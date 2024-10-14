import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class StudentService {
  async getTeacherStudents(user: User, page: number = 1, perPage: number = 10) {
    await user.load('teacher')

    if (!user.teacher) {
      throw new Error('Guru tidak ditemukan')
    }

    const classes = await user.teacher.related('classes').query()
    const classIds = classes.map((classItem) => classItem.id)

    const studentQuery = db.from('students').whereIn('class_id', classIds)

    const students = await studentQuery.paginate(page, perPage)

    return students
  }
}
