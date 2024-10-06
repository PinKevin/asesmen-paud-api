import { Gender, Religion } from '#enum/user_interface'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'teachers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('nuptk').notNullable()
      table.string('place_of_birth')
      table.date('date_of_birth')
      table.enum('gender', Object.values(Gender))
      table.enum('religion', Object.values(Religion))
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
