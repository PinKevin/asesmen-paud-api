import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { Gender, Religion } from '#enum/user_enum'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import AnecdotalAssessment from './anecdotal_assessment.js'
import Class from './class.js'

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Class)
  declare classes: ManyToMany<typeof Class>

  @hasMany(() => AnecdotalAssessment)
  declare anecdotalAssessments: HasMany<typeof AnecdotalAssessment>
}
