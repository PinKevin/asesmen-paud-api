import { TeacherFactory } from '#database/factories/teacher_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await TeacherFactory.createMany(10)
  }
}
