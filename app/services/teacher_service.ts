import { AccountStatus } from '#enum/user_enum'
import { CompleteTeacherDataDto, NewUserEmailDto } from '#dto/auth_dto'
import Teacher from '#models/teacher'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

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

      const teacher = await Teacher.create(
        {
          userId: user.id,
        },
        { client: trx }
      )

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

  async completeTeacherInfo({
    id,
    name,
    nuptk,
    placeOfBirth,
    dateOfBirth,
    gender,
    religion,
  }: CompleteTeacherDataDto) {
    try {
      const teacher = await Teacher.findOrFail(id)

      if (teacher.name !== null) {
        throw Error('Anda sudah melakukan pendaftaran')
      }

      const user = await User.findOrFail(teacher.userId)

      teacher.merge({
        name,
        nuptk,
        placeOfBirth,
        dateOfBirth: DateTime.fromJSDate(dateOfBirth),
        gender,
        religion,
      })

      user.merge({
        accountStatus: AccountStatus.active,
      })

      await teacher.save()
      await user.save()

      return teacher.serialize()
    } catch (error) {
      throw error
    }
  }

  async getTeacherClass(user: User) {
    await user.load('teacher')

    if (!user.teacher) {
      throw new Error('Guru tidak ditemukan')
    }

    const classesQuery = user.teacher.related('classes').query()

    const classes = await classesQuery
    return classes
  }
}
