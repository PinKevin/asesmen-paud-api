import { CreateStudentDto, EditStudentDto } from '#dto/student_dto'
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
        .select('students.*', 'classes.id as class_id', 'classes.name as class_name')
        .innerJoin('class_student', 'students.id', 'class_student.student_id')
        .innerJoin('classes', 'class_student.class_id', 'classes.id')
        .whereIn('class_student.class_id', classIds)

      if (searchQuery) {
        studentQuery
          .whereRaw('LOWER(students.name) LIKE ?', [`%${searchQuery.toLowerCase()}%`])
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

  async addStudent(
    {
      name,
      nisn,
      placeOfBirth,
      dateOfBirth,
      gender,
      religion,
      acceptanceDate,
      photoProfileLink,
      classId,
    }: CreateStudentDto,
    user: User
  ) {
    const trx = await db.transaction()

    try {
      // Load teacher
      await user.load('teacher')

      if (!user.teacher) {
        throw new Error('Guru tidak ditemukan')
      }

      // Check class
      const classOwned = await user.teacher
        .related('classes')
        .query()
        .where('classes.id', classId)
        .first()

      if (!classOwned) {
        throw new Error('Guru tidak memiliki akses ke kelas ini')
      }

      // Insert student
      const student = await Student.create(
        {
          name,
          nisn,
          placeOfBirth,
          dateOfBirth,
          gender,
          religion,
          acceptanceDate,
          photoProfileLink,
        },
        { client: trx }
      )

      // Attach student to class of teacher
      await classOwned.related('students').attach([student.id], trx)

      await trx.commit()
      return student
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getStudentInfo(id: number) {
    const student = await Student.query()
      .where('id', id)
      .preload('classes', (query) => {
        query.select('id', 'name').orderBy('id', 'desc').limit(1)
      })
      .firstOrFail()

    const latestClassName = student.classes[0].name
    const latestClassId = student.classes[0].id

    return {
      name: student.name,
      nisn: student.nisn,
      placeOfBirth: student.placeOfBirth,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      religion: student.religion,
      acceptanceDate: student.acceptanceDate,
      photoProfileLink: student.photoProfileLink,
      className: latestClassName,
      classId: latestClassId,
    }
  }

  async editStudent(
    id: number,
    {
      name,
      nisn,
      placeOfBirth,
      dateOfBirth,
      gender,
      religion,
      acceptanceDate,
      photoProfileLink,
      classId,
    }: EditStudentDto,
    user: User
  ) {
    const trx = await db.transaction()

    try {
      // Load teacher
      await user.load('teacher')

      if (!user.teacher) {
        throw new Error('Guru tidak ditemukan')
      }

      // Check class
      const classOwned = await user.teacher
        .related('classes')
        .query()
        .where('classes.id', classId)
        .first()

      if (!classOwned) {
        throw new Error('Guru tidak memiliki akses ke kelas ini')
      }

      // Get student
      const student = await Student.findOrFail(id)

      // Update student
      student.merge({
        name,
        nisn,
        placeOfBirth,
        dateOfBirth,
        gender,
        religion,
        acceptanceDate,
        photoProfileLink,
      })

      await student.useTransaction(trx).save()

      // Update student's class
      // await student.related('classes').detach([], trx)
      const existingCLass = await student
        .related('classes')
        .query()
        .where('classes.id', classId)
        .first()

      if (!existingCLass) {
        await student.related('classes').attach([classId], trx)
      }

      const updatedStudent = await Student.query()
        .where('id', student.id)
        .preload('classes', (query) => query.select('id', 'name'))
        .firstOrFail()

      await trx.commit()
      return updatedStudent
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async deleteStudent(id: number, user: User) {
    const trx = await db.transaction()

    try {
      await user.load('teacher')
      if (!user.teacher) {
        throw new Error('Guru tidak ditemukan')
      }

      const student = await Student.findOrFail(id)

      const classOwned = await user.teacher
        .related('classes')
        .query()
        .whereHas('students', (query) => query.where('students.id', student.id))
        .first()

      if (!classOwned) {
        throw new Error('Murid tidak ditemukan dalam kelas yang dimiliki guru')
      }

      await student.related('classes').detach([], trx)
      await student.useTransaction(trx).delete()

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
