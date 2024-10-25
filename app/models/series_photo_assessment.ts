import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import SeriesPhoto from './series_photo.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import LearningGoal from './learning_goal.js'

export default class SeriesPhotoAssessment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare feedback: string

  @column()
  declare studentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SeriesPhoto)
  declare seriesPhotos: HasMany<typeof SeriesPhoto>

  @manyToMany(() => LearningGoal, {
    pivotTable: 'series_photo_points',
  })
  declare learningGoals: ManyToMany<typeof LearningGoal>
}
