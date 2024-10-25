import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import SeriesPhotoAssessment from './series_photo_assessment.js'

export default class SeriesPhoto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare photoLink: string

  @column()
  declare seriesPhotoAssessmentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => SeriesPhotoAssessment)
  declare seriesPhotoAssessment: BelongsTo<typeof SeriesPhotoAssessment>
}
