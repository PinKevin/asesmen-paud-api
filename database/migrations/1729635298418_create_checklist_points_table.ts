import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'checklist_points'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.text('context')
      table.text('observed_event')
      table.boolean('has_appeared')
      table.bigInteger('checklist_assessment_id').unsigned().references('checklist_assessments.id')
      table.bigInteger('learning_goal_id').unsigned().references('learning_goals.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
