import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ChecklistAssessment from './checklist_assessment.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import LearningGoal from './learning_goal.js'

export default class ChecklistPoint extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare context: string

  @column()
  declare observedEvent: string

  @column()
  declare hasAppeared: boolean

  @column()
  declare checklistAssessmentId: number

  @column()
  declare learningGoalId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => ChecklistAssessment)
  declare checklistAssessment: BelongsTo<typeof ChecklistAssessment>

  @belongsTo(() => LearningGoal)
  declare learningGoal: BelongsTo<typeof LearningGoal>
}
