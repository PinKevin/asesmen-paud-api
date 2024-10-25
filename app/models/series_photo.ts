import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import PhotoSeriesAssessment from './photo_series_assessment.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class SeriesPhoto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare photoLink: string

  @column()
  declare photoSeriesAssessmentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => PhotoSeriesAssessment)
  declare photoSeriesAssessment: BelongsTo<typeof PhotoSeriesAssessment>
}
