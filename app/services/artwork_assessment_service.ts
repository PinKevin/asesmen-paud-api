import { CreateArtworkDto, EditArtworkDto } from '#dto/artwork_dto'
import {
  defaultGetAllAssessmentsOptions,
  GetAllAssessmentsOptions,
  getDateTimeRange,
} from '#dto/get_all_options'
import ArtworkAssessment from '#models/artwork_assessment'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ArtworkAssessmentService {
  async getAllAssessments(studentId: number, options: GetAllAssessmentsOptions = {}) {
    const { page, limit, sortOrder, usePagination } = {
      ...defaultGetAllAssessmentsOptions,
      ...options,
    }

    const { startDateTime, endDateTime } = getDateTimeRange(options)

    const artworksQuery = ArtworkAssessment.query()
      .where('student_id', studentId)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .orderBy('created_at', sortOrder)

    const artworks = usePagination ? await artworksQuery.paginate(page, limit) : await artworksQuery

    return artworks
  }

  async addAssessment({
    photoLink,
    description,
    feedback,
    studentId,
    learningGoals,
  }: CreateArtworkDto) {
    const trx = await db.transaction()

    try {
      const artwork = await ArtworkAssessment.create(
        {
          photoLink,
          description,
          feedback,
          studentId,
        },
        { client: trx }
      )

      if (learningGoals && learningGoals.length) {
        await artwork.related('learningGoals').attach(learningGoals, trx)
      }

      await trx.commit()

      return artwork
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getDetailAssessment(studentId: number, assessmentId: number) {
    const artwork = await ArtworkAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    return artwork
  }

  async updateAssessment(
    studentId: number,
    assessmentId: number,
    { photoLink, description, feedback, learningGoals }: EditArtworkDto
  ) {
    const artwork = await ArtworkAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      let fileName = artwork.photoLink
      if (photoLink && photoLink !== artwork.photoLink) {
        if (fileName) {
          await disk.delete(fileName)
        }

        fileName = photoLink
      }

      artwork.merge({
        photoLink: fileName,
        description: description ?? artwork.description,
        feedback: feedback ?? artwork.feedback,
        studentId,
      })

      if (learningGoals && learningGoals.length) {
        await artwork.related('learningGoals').detach([], trx)
        await artwork.related('learningGoals').attach(learningGoals, trx)

        artwork.updatedAt = DateTime.now()
      }

      await artwork.useTransaction(trx).save()

      await trx.commit()

      await artwork.load('learningGoals')
      return artwork
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessment(studentId: number, assessmentId: number) {
    const artwork = await ArtworkAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const disk = drive.use()
    await disk.delete(artwork.photoLink)

    await artwork.related('learningGoals').detach([])
    await artwork.delete()
  }
}
