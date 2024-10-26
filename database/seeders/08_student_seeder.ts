import { StudentFactory } from '#database/factories/student_factory'
import Class from '#models/class'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const classes = await Class.all()

    for (let i = 0; i < 20; i++) {
      const student = await StudentFactory.merge({
        photoProfileLink: 'pp-profile-test.jpeg',
      }).create()
      const randomClasses = classes
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * classes.length) + 1)

      const attachData: { [key: number]: { created_at: string; updated_at: string } } = {}

      randomClasses.forEach((cls) => {
        attachData[cls.id] = {
          created_at: DateTime.local().toSQL(),
          updated_at: DateTime.local().toSQL(),
        }
      })

      await student.related('classes').attach(attachData)
    }
  }
}
