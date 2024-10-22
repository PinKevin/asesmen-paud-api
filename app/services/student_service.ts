import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class StudentService {
  async getTeacherStudents(
    user: User,
    className?: string,
    page: number = 1,
    perPage: number = 10,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    await user.load('teacher')

    if (!user.teacher) {
      throw new Error('Guru tidak ditemukan')
    }

    const classesQuery = user.teacher.related('classes').query()
    if (className) {
      classesQuery.where('name', className)
    }

    const classes = await classesQuery
    const classIds = classes.map((classItem) => classItem.id)

    const studentQuery = db
      .from('students')
      .select('students.*')
      .innerJoin('class_student', 'students.id', 'class_student.student_id')
      .whereIn('class_student.class_id', classIds)
      .with('classes', (query) => {
        query.orderBy('class_student.created_at', 'desc')
      })

    studentQuery.orderBy('students.name', sortOrder)

    const students = await studentQuery.paginate(page, perPage)

    return students
  }
}
