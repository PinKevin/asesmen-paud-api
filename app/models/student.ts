import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { Gender, Religion } from '#enum/user_enum'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import AnecdotalAssessment from './anecdotal_assessment.js'
import Class from './class.js'
import ArtworkAssessment from './artwork_assessment.js'
import ChecklistAssessment from './checklist_assessment.js'
import SeriesPhotoAssessment from './series_photo_assessment.js'
import ReportPrintHistory from './report_print_history.js'

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
  declare photoProfileLink: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Class)
  declare classes: ManyToMany<typeof Class>

  @hasMany(() => AnecdotalAssessment)
  declare anecdotalAssessments: HasMany<typeof AnecdotalAssessment>

  @hasMany(() => ArtworkAssessment)
  declare artworkAssessments: HasMany<typeof ArtworkAssessment>

  @hasMany(() => ChecklistAssessment)
  declare checklistAssessments: HasMany<typeof ChecklistAssessment>

  @hasMany(() => SeriesPhotoAssessment)
  declare seriesPhotoAssessments: HasMany<typeof SeriesPhotoAssessment>

  @hasMany(() => ReportPrintHistory)
  declare reportPrintHistories: HasMany<typeof ReportPrintHistory>
}
