import { CreateAnecdotalDto, EditAnecdotalDto } from '#dto/anecdotal_dto'
import AnecdotalAssessment from '#models/anecdotal_assessment'
import Student from '#models/student'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'

export default class AnecdotalAssessmentService {
  async getAllAssessments(id: number, page: number, limit: number) {
    const student = await Student.findOrFail(id)

    const anecdotals = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .preload('learningGoals')
      .paginate(page, limit)

    return anecdotals
  }

  async addAssessments({
    photo,
    description,
    feedback,
    studentId,
    learningGoals,
  }: CreateAnecdotalDto) {
    const trx = await db.transaction()

    try {
      const fileName = `${cuid()}.${photo.extname}`
      await photo.moveToDisk(fileName)

      const assessments = await AnecdotalAssessment.create(
        {
          photoLink: fileName,
          description,
          feedback,
          studentId,
        },
        { client: trx }
      )

      if (learningGoals && learningGoals.length) {
        await assessments.related('learningGoals').attach(learningGoals, trx)
      }

      await trx.commit()

      return assessments
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getDetailAssessments(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    return anecdotal
  }

  async updateAssessments(
    id: number,
    assessmentId: number,
    { photo, description, feedback, learningGoals }: EditAnecdotalDto
  ) {
    const student = await Student.findOrFail(id)

    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      let fileName = anecdotal.photoLink
      if (photo) {
        await disk.delete(fileName)

        fileName = `${cuid()}.${photo.extname}`
        await photo.moveToDisk(fileName)
      }

      anecdotal
        .merge({
          photoLink: fileName,
          description: description ?? anecdotal.description,
          feedback: feedback ?? anecdotal.feedback,
          studentId: id,
        })
        .useTransaction(trx)
        .save()

      if (learningGoals && learningGoals.length) {
        await anecdotal.related('learningGoals').detach([], trx)
        await anecdotal.related('learningGoals').attach(learningGoals, trx)
      }

      await trx.commit()

      await anecdotal.load('learningGoals')
      return anecdotal
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessments(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const disk = drive.use()
    await disk.delete(anecdotal.photoLink)

    await anecdotal.related('learningGoals').detach([])
    await anecdotal.delete()
  }
}
