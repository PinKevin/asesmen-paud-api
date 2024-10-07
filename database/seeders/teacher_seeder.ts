import { TeacherFactory } from '#database/factories/teacher_factory'
import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      const users = await UserFactory.client(trx).createMany(5)

      for (const user of users) {
        await TeacherFactory.client(trx)
          .merge({
            userId: user.id,
          })
          .create()
      }
    })
  }
}
