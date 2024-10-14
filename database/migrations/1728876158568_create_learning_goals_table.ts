import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'learning_goals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('learning_goal_name').notNullable()
      table.string('learning_goal_code', 2).notNullable()
      table.bigInteger('sub_learning_scope_id').unsigned().references('sub_learning_scopes.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
