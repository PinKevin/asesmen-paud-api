import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { Gender, Religion } from '#enum/user_enum'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Teacher extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare nuptk: string

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

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
