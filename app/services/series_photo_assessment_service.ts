import { CreateSeriesPhotoDto } from '#dto/photo_series_dto'
import SeriesPhotoAssessment from '#models/series_photo_assessment'
import SeriesPhoto from '#models/series_photo'
import Student from '#models/student'
import { cuid } from '@adonisjs/core/helpers'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class SeriesPhotoAssessmentService {
  async getAllAssessments(
    id: number,
    page: number = 1,
    limit: number = 10,
    startDate: string = DateTime.now().minus({ days: 7 }).toFormat('yyyy-LL-dd'),
    endDate: string = DateTime.now().toFormat('yyyy-LL-dd'),
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const student = await Student.findOrFail(id)

    const startDateTime = DateTime.fromISO(startDate).set({ hour: 0, minute: 0, second: 0 }).toSQL()
    const endDateTime = DateTime.fromISO(endDate).set({ hour: 23, minute: 59, second: 59 }).toSQL()

    const seriesPhoto = await SeriesPhotoAssessment.query()
      .where('student_id', student.id)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .preload('seriesPhotos')
      .orderBy('created_at', sortOrder)
      .paginate(page, limit)

    return seriesPhoto
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
          const fileName = `${cuid()}.${photo.extname}`
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
}
