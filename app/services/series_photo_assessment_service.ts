import { CreateSeriesPhotoDto, EditSeriesPhotoDto } from '#dto/photo_series_dto'
import SeriesPhotoAssessment from '#models/series_photo_assessment'
import SeriesPhoto from '#models/series_photo'
import { cuid } from '@adonisjs/core/helpers'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import drive from '@adonisjs/drive/services/main'
import { GetAllAssessmentsOptions } from '#dto/get_all_options'

export default class SeriesPhotoAssessmentService {
  async getAllAssessments(studentId: number, options: GetAllAssessmentsOptions = {}) {
    const {
      page = 1,
      limit = 10,
      startDate = DateTime.now().minus({ days: 7 }).toFormat('yyyy-LL-dd'),
      endDate = DateTime.now().toFormat('yyyy-LL-dd'),
      sortOrder = 'desc',
      usePagination = true,
    } = options

    const startDateTime = DateTime.fromISO(startDate).set({ hour: 0, minute: 0, second: 0 }).toSQL()
    const endDateTime = DateTime.fromISO(endDate).set({ hour: 23, minute: 59, second: 59 }).toSQL()

    const seriesPhotosQuery = SeriesPhotoAssessment.query()
      .where('student_id', studentId)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .preload('seriesPhotos')
      .orderBy('created_at', sortOrder)

    const seriesPhotos = usePagination
      ? await seriesPhotosQuery.paginate(page, limit)
      : await seriesPhotosQuery

    return seriesPhotos
  }

  async addAssessment({
    description,
    feedback,
    studentId,
    learningGoals,
    photos,
  }: CreateSeriesPhotoDto) {
    const trx = await db.transaction()

    try {
      if (photos.length < 3 || photos.length > 5) {
        throw new Error('unggah 3-5 foto')
      }

      const seriesPhoto = await SeriesPhotoAssessment.create(
        {
          studentId,
          description,
          feedback,
        },
        { client: trx }
      )

      const photoPaths = await Promise.all(
        photos.map(async (photo) => {
          const fileName = `series-photo-${studentId}-${cuid()}.${photo.extname}`
          await photo.moveToDisk(fileName)
          return fileName
        })
      )

      for (const photoPath of photoPaths) {
        await SeriesPhoto.create(
          { seriesPhotoAssessmentId: seriesPhoto.id, photoLink: photoPath },
          { client: trx }
        )
      }

      await seriesPhoto.related('learningGoals').attach(learningGoals)

      await trx.commit()

      return seriesPhoto
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getDetailAssessment(studentId: number, assessmentId: number) {
    const seriesPhoto = await SeriesPhotoAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .preload('seriesPhotos')
      .firstOrFail()

    return seriesPhoto
  }

  async updateAssessment(
    studentId: number,
    assessmentId: number,
    { photos, description, feedback, learningGoals }: EditSeriesPhotoDto
  ) {
    const seriesPhoto = await SeriesPhotoAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .preload('seriesPhotos')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      seriesPhoto
        .merge({
          description: description ?? seriesPhoto.description,
          feedback: feedback ?? seriesPhoto.feedback,
        })
        .useTransaction(trx)
        .save()

      if (learningGoals && learningGoals.length) {
        await seriesPhoto.related('learningGoals').detach([], trx)
        await seriesPhoto.related('learningGoals').attach(learningGoals, trx)
      }

      if (photos?.length !== 0) {
        if (photos!.length < 3 || photos!.length > 5) {
          throw new Error('unggah 3-5 foto')
        }

        const existingPhotos = seriesPhoto.seriesPhotos
        for (const existingPhoto of existingPhotos) {
          await disk.delete(existingPhoto.photoLink)
          await existingPhoto.useTransaction(trx).delete()
        }

        const photoPaths = await Promise.all(
          photos!.map(async (photo) => {
            const fileName = `series-photo-${studentId}-${cuid()}.${photo.extname}`
            await photo.moveToDisk(fileName)
            return fileName
          })
        )

        for (const photoPath of photoPaths) {
          await SeriesPhoto.create(
            { seriesPhotoAssessmentId: seriesPhoto.id, photoLink: photoPath },
            { client: trx }
          )
        }
      }

      await trx.commit()
      await seriesPhoto.load('learningGoals')
      await seriesPhoto.load('seriesPhotos')
      return seriesPhoto
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessment(studentId: number, assessmentId: number) {
    const seriesPhoto = await SeriesPhotoAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .preload('seriesPhotos')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      await seriesPhoto.related('learningGoals').detach([], trx)

      const existingPhotos = seriesPhoto.seriesPhotos
      for (const existingPhoto of existingPhotos) {
        await disk.delete(existingPhoto.photoLink)
        await existingPhoto.useTransaction(trx).delete()
      }

      await seriesPhoto.useTransaction(trx).delete()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
