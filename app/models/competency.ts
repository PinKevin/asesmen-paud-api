import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import LearningScope from './learning_scope.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Competency extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare competencyName: string

  @column()
  declare element: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => LearningScope)
  declare learningScopes: HasMany<typeof LearningScope>
}
