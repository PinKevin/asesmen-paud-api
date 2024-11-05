import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SchoolYear extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isEvenSemester: boolean

  @column()
  declare startYear: number

  @column()
  declare endYear: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
