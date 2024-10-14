import { ClassFactory } from '#database/factories/class_factory'
import { TeacherFactory } from '#database/factories/teacher_factory'
import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      const users = await UserFactory.client(trx).createMany(5)

      for (const user of users) {
        const teacher = await TeacherFactory.client(trx)
          .merge({
            userId: user.id,
          })
          .create()

        /* for many classes, use this */
        // const numberOfClasses = Math.floor(Math.random() * 3) + 1
        // const classes = await ClassFactory.client(trx).createMany(numberOfClasses)
        // await teacher.related('classes').attach(
        //   classes.map((cls) => cls.id),
        //   trx
        // )

        /* for one class, use this */
        const teacherClass = await ClassFactory.client(trx).create()
        await teacher.related('classes').attach([teacherClass.id], trx)
      }
    })
  }
}
