import { CreateAnecdotalDto, EditAnecdotalDto } from '#dto/anecdotal_dto'
import { GetAllAssessmentsOptions } from '#dto/get_all_options'
import AnecdotalAssessment from '#models/anecdotal_assessment'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AnecdotalAssessmentService {
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

    const anecdotalsQuery = AnecdotalAssessment.query()
      .where('student_id', studentId)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .orderBy('created_at', sortOrder)

    const anecdotals = usePagination
      ? await anecdotalsQuery.paginate(page, limit)
      : await anecdotalsQuery

    return anecdotals
  }

  async addAssessment({
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

  async getDetailAssessment(studentId: number, assessmentId: number) {
    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    return anecdotal
  }

  async updateAssessment(
    studentId: number,
    assessmentId: number,
    { photoLink, description, feedback, learningGoals }: EditAnecdotalDto
  ) {
    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const trx = await db.transaction()
    const disk = drive.use()

    try {
      let fileName = anecdotal.photoLink
      if (photoLink && photoLink !== anecdotal.photoLink) {
        if (fileName) {
          await disk.delete(fileName)
        }

        fileName = photoLink
      }

      anecdotal.merge({
        photoLink: fileName,
        description: description ?? anecdotal.description,
        feedback: feedback ?? anecdotal.feedback,
        studentId: studentId,
      })

      if (learningGoals && learningGoals.length) {
        await anecdotal.related('learningGoals').detach([], trx)
        await anecdotal.related('learningGoals').attach(learningGoals, trx)

        anecdotal.updatedAt = DateTime.now()
      }

      await anecdotal.useTransaction(trx).save()

      await trx.commit()

      await anecdotal.load('learningGoals')
      return anecdotal
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessment(studentId: number, assessmentId: number) {
    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    const disk = drive.use()
    await disk.delete(anecdotal.photoLink)

    await anecdotal.related('learningGoals').detach([])
    await anecdotal.delete()
  }
}
