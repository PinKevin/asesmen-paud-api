import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Competency from './competency.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import SubLearningScope from './sub_learning_scope.js'

export default class LearningScope extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare learningScopeName: string

  @column()
  declare competencyId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Competency)
  declare competency: BelongsTo<typeof Competency>

  @hasMany(() => SubLearningScope)
  declare subLearningScopes: HasMany<typeof SubLearningScope>
}
