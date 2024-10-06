import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Gender, Religion } from '#enum/user_interface'

export default class Teacher extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare nuptk: string

  @column()
  declare placeOfBirth: string

  @column.dateTime()
  declare dateOfBirth: DateTime

  @column()
  declare gender: Gender

  @column()
  declare religion: Religion

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
