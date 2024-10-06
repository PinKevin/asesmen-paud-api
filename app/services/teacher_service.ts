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

      await teacher
        .merge({
          name,
          nuptk,
          placeOfBirth,
          dateOfBirth: DateTime.fromJSDate(dateOfBirth),
          gender,
          religion,
        })
        .save()

      teacher.serialize()
      return teacher
    } catch (error) {
      throw error
    }
  }
}
