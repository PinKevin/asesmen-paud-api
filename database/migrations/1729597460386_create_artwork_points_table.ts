import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artwork_points'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('learning_goal_id').unsigned().references('learning_goals.id')
      table.bigInteger('artwork_assessment_id').unsigned().references('artwork_assessments.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
