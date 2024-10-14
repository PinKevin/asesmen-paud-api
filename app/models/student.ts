import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { Gender, Religion } from '#enum/user_enum'
import Class from './class.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare nisn: string

  @column()
  declare placeOfBirth: string

  @column.date({
    serialize: (value: DateTime) => {
      return value ? value.toISO() : value
    },
  })
  declare dateOfBirth: DateTime

  @column()
  declare gender: Gender

  @column()
  declare religion: Religion

  @column.date({
    serialize: (value: DateTime) => {
      return value ? value.toISO() : value
    },
  })
  declare acceptanceDate: DateTime

  @column()
  declare classId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Class)
  declare studentClass: BelongsTo<typeof Class>
}
