import { CreateChecklistDto, EditChecklistDto } from '#dto/checklist_dto'
import ChecklistAssessment from '#models/checklist_assessment'
import ChecklistPoint from '#models/checklist_point'
import Student from '#models/student'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class ChecklistAssessmentService {
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

    const checklists = await ChecklistAssessment.query()
      .where('student_id', student.id)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('checklistPoints')
      .orderBy('created_at', sortOrder)
      .paginate(page, limit)

    return checklists
  }

  async addAssessment({ studentId, checklistPoints }: CreateChecklistDto) {
    const trx = await db.transaction()

    try {
      const checklist = await ChecklistAssessment.create(
        {
          studentId: studentId,
        },
        { client: trx }
      )

      for (const point of checklistPoints) {
        await ChecklistPoint.create(
          {
            learningGoalId: point.learningGoalId,
            context: point.context,
            observedEvent: point.observedEvent,
            hasAppeared: point.hasAppeared,
            checklistAssessmentId: checklist.id,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return checklist
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getDetailAssessment(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const checklist = await ChecklistAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('checklistPoints')
      .firstOrFail()

    return checklist
  }

  async updateAssessment(id: number, assessmentId: number, { checklistPoints }: EditChecklistDto) {
    const student = await Student.findOrFail(id)

    const checklist = await ChecklistAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('checklistPoints')
      .firstOrFail()

    const trx = await db.transaction()

    try {
      if (checklistPoints) {
        await ChecklistPoint.query({ client: trx })
          .where('checklist_assessment_id', checklist.id)
          .delete()

        for (const point of checklistPoints) {
          await ChecklistPoint.create(
            {
              learningGoalId: point.learningGoalId,
              context: point.context,
              observedEvent: point.observedEvent,
              hasAppeared: point.hasAppeared,
              checklistAssessmentId: checklist.id,
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
      await checklist.load('checklistPoints')
      return checklist
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessment(id: number, assessmentId: number) {
    const student = await Student.findOrFail(id)

    const checklist = await ChecklistAssessment.query()
      .where('student_id', student.id)
      .where('id', assessmentId)
      .preload('checklistPoints')
      .firstOrFail()

    await checklist.related('checklistPoints').query().delete()
    await checklist.delete()
  }
}
