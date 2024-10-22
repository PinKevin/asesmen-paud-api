import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ChecklistPoint from './checklist_point.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ChecklistAssessment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare studentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => ChecklistPoint)
  declare checklistPoints: HasMany<typeof ChecklistPoint>
}
