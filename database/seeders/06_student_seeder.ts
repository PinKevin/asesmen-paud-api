import { StudentFactory } from '#database/factories/student_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    const classes = await db.from('classes').count('* as total')

    for (let i = 0; i < 20; i++) {
      const classId = Math.floor(Math.random() * classes[0].total) + 1
      await StudentFactory.merge({ classId }).create()
    }
  }
}
