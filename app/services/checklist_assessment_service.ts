import { CreateChecklistDto, EditChecklistDto } from '#dto/checklist_dto'
import {
  defaultGetAllAssessmentsOptions,
  GetAllAssessmentsOptions,
  getDateTimeRange,
} from '#dto/get_all_options'
import ChecklistAssessment from '#models/checklist_assessment'
import ChecklistPoint from '#models/checklist_point'
import db from '@adonisjs/lucid/services/db'

export default class ChecklistAssessmentService {
  async getAllAssessments(studentId: number, options: GetAllAssessmentsOptions = {}) {
    const { page, limit, sortOrder, usePagination } = {
      ...defaultGetAllAssessmentsOptions,
      ...options,
    }

    const { startDateTime, endDateTime } = getDateTimeRange(options)

    const checklistsQuery = ChecklistAssessment.query()
      .where('student_id', studentId)
      .whereBetween('created_at', [startDateTime!, endDateTime!])
      .preload('checklistPoints', (query) => {
        query.preload('learningGoal')
      })
      .orderBy('created_at', sortOrder)

    const checklists = usePagination
      ? await checklistsQuery.paginate(page, limit)
      : await checklistsQuery

    return checklists
  }

  async addAssessment({ studentId, checklistPoints }: CreateChecklistDto) {
    const trx = await db.transaction()

    try {
      const checklist = await ChecklistAssessment.create(
        {
          studentId,
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

  async getDetailAssessment(studentId: number, assessmentId: number) {
    const checklist = await ChecklistAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('checklistPoints', (query) => {
        query.preload('learningGoal')
      })
      .firstOrFail()

    return checklist
  }

  async updateAssessment(
    studentId: number,
    assessmentId: number,
    { checklistPoints }: EditChecklistDto
  ) {
    const checklist = await ChecklistAssessment.query()
      .where('student_id', studentId)
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
      await checklist.load('checklistPoints', (query) => {
        query.preload('learningGoal')
      })
      return checklist
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteAssessment(studentId: number, assessmentId: number) {
    const checklist = await ChecklistAssessment.query()
      .where('student_id', studentId)
      .where('id', assessmentId)
      .preload('checklistPoints')
      .firstOrFail()

    await checklist.related('checklistPoints').query().delete()
    await checklist.delete()
  }
}
