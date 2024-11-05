import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'school_years'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('is_even_semester')
      table.integer('start_year')
      table.integer('end_year')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
