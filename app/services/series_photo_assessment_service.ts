import { CreateSeriesPhotoDto, EditSeriesPhotoDto } from '#dto/photo_series_dto'
import SeriesPhotoAssessment from '#models/series_photo_assessment'
import SeriesPhoto from '#models/series_photo'
import db from '@adonisjs/lucid/services/db'
import drive from '@adonisjs/drive/services/main'
import {
  defaultGetAllAssessmentsOptions,
  GetAllAssessmentsOptions,
  getDateTimeRange,
} from '#dto/get_all_options'
import { DateTime } from 'luxon'

export default class SeriesPhotoAssessmentService {
  async getAllAssessments(studentId: number, options: GetAllAssessmentsOptions = {}) {
    const { page, limit, sortOrder, usePagination } = {
      ...defaultGetAllAssessmentsOptions,
      ...options,
    }

    const { startDateTime, endDateTime } = getDateTimeRange(options)

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
    photoLinks,
  }: CreateSeriesPhotoDto) {
    const trx = await db.transaction()

    try {
      const seriesPhoto = await SeriesPhotoAssessment.create(
        {
          studentId,
          description,
          feedback,
        },
        { client: trx }
      )

      for (const link of photoLinks) {
        await SeriesPhoto.create(
          { seriesPhotoAssessmentId: seriesPhoto.id, photoLink: link },
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
    { photoLinks, description, feedback, learningGoals }: EditSeriesPhotoDto
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
      seriesPhoto.merge({
        description: description ?? seriesPhoto.description,
        feedback: feedback ?? seriesPhoto.feedback,
      })

      if (learningGoals && learningGoals.length) {
        await seriesPhoto.related('learningGoals').detach([], trx)
        await seriesPhoto.related('learningGoals').attach(learningGoals, trx)

        seriesPhoto.updatedAt = DateTime.now()
      }

      if (photoLinks?.length !== 0) {
        const existingPhotos = seriesPhoto.seriesPhotos
        const existingPhotoLinks = existingPhotos.map((photo) => photo.photoLink)

        const linksToDelete = existingPhotoLinks.filter((link) => !photoLinks!.includes(link))
        const linksToAdd = photoLinks!.filter((link) => !existingPhotoLinks.includes(link))

        for (const link of linksToDelete) {
          const photo = existingPhotos.find((p) => p.photoLink === link)
          if (photo) {
            await disk.delete(photo.photoLink)
            await photo.useTransaction(trx).delete()
          }
        }

        for (const photoPath of linksToAdd) {
          await SeriesPhoto.create(
            { seriesPhotoAssessmentId: seriesPhoto.id, photoLink: photoPath },
            { client: trx }
          )
        }
      }

      await seriesPhoto.useTransaction(trx).save()
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
