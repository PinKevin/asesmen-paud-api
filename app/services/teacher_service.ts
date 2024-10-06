import { AccountStatus } from '#enum/user_enum'
import { NewUserEmailDto } from '#interface/auth_interface'
import Teacher from '#models/teacher'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class TeacherService {
  async createTeacherUser({ email, password }: NewUserEmailDto) {
    const trx = await db.transaction()

    try {
      const user = await User.create(
        {
          email,
          password,
          accountStatus: AccountStatus.pending,
        },
        { client: trx }
      )
      user.serialize()

      const teacher = await Teacher.create(
        {
          userId: user.id,
        },
        { client: trx }
      )
      teacher.serialize()

      await trx.commit()

      return {
        user: {
          id: user.id,
          email: user.email,
          accountStatus: user.accountStatus,
        },
        teacher: {
          id: teacher.id,
        },
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
