import Student from '#models/student'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class StudentService {
  async getTeacherStudents(
    user: User,
    searchQuery?: string,
    classId?: number,
    page: number = 1,
    perPage: number = 10,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    try {
      await user.load('teacher')

      if (!user.teacher) {
        throw new Error('Guru tidak ditemukan')
      }

      const classesQuery = user.teacher.related('classes').query()
      if (classId) {
        classesQuery.where('classes.id', classId)
      }

      const classes = await classesQuery
      const classIds = classes.map((classItem) => classItem.id)

      const studentQuery = db
        .from('students')
        .distinct('students.id')
        .select('students.*')
        .innerJoin('class_student', 'students.id', 'class_student.student_id')
        .whereIn('class_student.class_id', classIds)

      if (searchQuery) {
        studentQuery
          .whereLike('students.name', `%${searchQuery}%`)
          .orWhereLike('students.nisn', `%${searchQuery}%`)
      }

      studentQuery.orderBy('students.name', sortOrder)

      const students = await studentQuery.paginate(page, perPage)

      return students
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getStudentInfo(id: number) {
    const student = await Student.query()
      .select('id', 'name', 'nisn', 'gender', 'religion', 'photoProfileLink')
      .where('id', id)
      .preload('classes', (query) => {
        query.select('name').orderBy('class_student.created_at', 'desc').limit(1)
      })
      .firstOrFail()

    const latestClass = student.classes[0].name

    return {
      name: student.name,
      nisn: student.nisn,
      gender: student.gender,
      religion: student.religion,
      class: latestClass,
      photoProfileLink: student.photoProfileLink,
    }
  }
}
