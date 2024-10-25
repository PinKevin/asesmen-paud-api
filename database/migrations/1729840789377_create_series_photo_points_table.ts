import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'series_photo_points'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('series_photo_assessment_id')
        .unsigned()
        .references('series_photo_assessments.id')
      table.bigInteger('learning_goal_id').unsigned().references('learning_goals.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
