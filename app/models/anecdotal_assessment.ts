import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import Student from './student.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import LearningGoal from './learning_goal.js'

export default class AnecdotalAssessment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date({
    serialize: (value: DateTime) => {
      return value ? value.toISO() : value
    },
  })
  declare assessmentDate: DateTime

  @column()
  declare photoLink: string

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

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @manyToMany(() => LearningGoal, {
    pivotTable: 'anecdotal_points',
  })
  declare learningGoals: ManyToMany<typeof LearningGoal>
}
