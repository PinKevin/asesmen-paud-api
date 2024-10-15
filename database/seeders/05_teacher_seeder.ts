import { ClassFactory } from '#database/factories/class_factory'
import { TeacherFactory } from '#database/factories/teacher_factory'
import { UserFactory } from '#database/factories/user_factory'
import { AccountStatus, Gender, Religion } from '#enum/user_enum'
import Teacher from '#models/teacher'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

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

      const myUser = await User.create(
        {
          email: 'orang@email.com',
          password: '12345678',
          accountStatus: AccountStatus.active,
        },
        { client: trx }
      )

      await Teacher.create(
        {
          name: 'Orang',
          nuptk: '1122334455667788',
          placeOfBirth: 'Semarang',
          dateOfBirth: DateTime.fromJSDate(new Date('2004-07-23')),
          gender: Gender.male,
          religion: Religion.christian,
          userId: myUser.id,
        },
        { client: trx }
      )
    })
  }
}
