import { CreateAnecdotalDto } from '#dto/anecdotal_dto'
import AnecdotalAssessment from '#models/anecdotal_assessment'
import Student from '#models/student'
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
    photoLink,
    description,
    feedback,
    studentId,
    learningGoals,
  }: CreateAnecdotalDto) {
    const trx = await db.transaction()

    try {
      const assessments = await AnecdotalAssessment.create(
        {
          photoLink,
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
}
