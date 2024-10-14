import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import SubLearningScope from './sub_learning_scope.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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
}
