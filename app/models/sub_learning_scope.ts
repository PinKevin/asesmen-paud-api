import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import LearningScope from './learning_scope.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import LearningGoal from './learning_goal.js'

export default class SubLearningScope extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare subLearningScopeName: string

  @column()
  declare learningScopeId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => LearningScope)
  declare learningScope: BelongsTo<typeof LearningScope>

  @hasMany(() => LearningGoal)
  declare learningGoals: HasMany<typeof LearningGoal>
}
