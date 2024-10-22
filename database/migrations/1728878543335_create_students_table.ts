import { Gender, Religion } from '#enum/user_enum'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('name')
      table.string('nisn', 10).unique()
      table.string('place_of_birth')
      table.date('date_of_birth')
      table.enum('gender', Object.values(Gender))
      table.enum('religion', Object.values(Religion))
      table.date('acceptance_date')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
