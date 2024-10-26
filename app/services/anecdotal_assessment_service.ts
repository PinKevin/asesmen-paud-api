import { CreateAnecdotalDto, EditAnecdotalDto } from '#dto/anecdotal_dto'
import { GetAllAssessmentsOptions } from '#dto/get_all_options'
import AnecdotalAssessment from '#models/anecdotal_assessment'
import Student from '#models/student'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class AnecdotalAssessmentService {
  async getAllAssessments(id: number, options: GetAllAssessmentsOptions = {}) {
    const {
      page = 1,
      limit = 10,
      startDate = DateTime.now().minus({ days: 7 }).toFormat('yyyy-LL-dd'),
      endDate = DateTime.now().toFormat('yyyy-LL-dd'),
      sortOrder = 'desc',
      usePagination = true,
    } = options

    const student = await Student.findOrFail(id)

    const startDateTime = DateTime.fromISO(startDate).set({ hour: 0, minute: 0, second: 0 }).toSQL()
    const endDateTime = DateTime.fromISO(endDate).set({ hour: 23, minute: 59, second: 59 }).toSQL()

    const anecdotalsQuery = AnecdotalAssessment.query()
      .where('student_id', student.id)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('learningGoals')
      .orderBy('created_at', sortOrder)

    const anecdotals = usePagination
      ? await anecdotalsQuery.paginate(page, limit)
      : await anecdotalsQuery

    return anecdotals
  }

  async addAssessment({
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

  async getDetailAssessment(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const anecdotal = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('learningGoals')
      .firstOrFail()

    return anecdotal
  }

  async updateAssessment(
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

  async deleteAssessment(id: number, assessmentId: number) {
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
