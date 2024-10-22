import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import SubLearningScope from './sub_learning_scope.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ChecklistPoint from './checklist_point.js'

export default class LearningGoal extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare learningGoalName: string

  @column()
  declare learningGoalCode: string

  @column()
  declare subLearningScopeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => SubLearningScope)
  declare subLearningScope: BelongsTo<typeof SubLearningScope>

  @hasMany(() => ChecklistPoint)
  declare checklistPoints: HasMany<typeof ChecklistPoint>
}
