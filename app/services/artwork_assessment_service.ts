import { CreateArtworkDto, EditArtworkDto } from '#dto/artwork_dto'
import ArtworkAssessment from '#models/artwork_assessment'
import Student from '#models/student'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ArtworkAssessmentService {
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

    const artworks = await ArtworkAssessment.query()
      .where('student_id', student.id)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .orderBy('created_at', sortOrder)
      .paginate(page, limit)

    return artworks
  }

  async addAssessments({
    photo,
    description,
    feedback,
    studentId,
    learningGoals,
  }: CreateArtworkDto) {
    const trx = await db.transaction()

    try {
      const fileName = `${cuid()}.${photo.extname}`
      await photo.moveToDisk(fileName)

      const artwork = await ArtworkAssessment.create(
        {
          photoLink: fileName,
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

  async getDetailAssessments(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const artwork = await ArtworkAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    return artwork
  }

  async updateAssessments(
    id: number,
    assessmentId: number,
    { photo, description, feedback, learningGoals }: EditArtworkDto
  ) {
    const student = await Student.findOrFail(id)

    const artwork = await ArtworkAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      let fileName = artwork.photoLink
      if (photo) {
        await disk.delete(fileName)

        fileName = `${cuid()}.${photo.extname}`
        await photo.moveToDisk(fileName)
      }

      artwork
        .merge({
          photoLink: fileName,
          description: description ?? artwork.description,
          feedback: feedback ?? artwork.feedback,
          studentId: id,
        })
        .useTransaction(trx)
        .save()

      if (learningGoals && learningGoals.length) {
        await artwork.related('learningGoals').detach([], trx)
        await artwork.related('learningGoals').attach(learningGoals, trx)
      }

      await trx.commit()

      await artwork.load('learningGoals')
      return artwork
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessments(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const artwork = await ArtworkAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const disk = drive.use()
    await disk.delete(artwork.photoLink)

    await artwork.related('learningGoals').detach([])
    await artwork.delete()
  }
}
