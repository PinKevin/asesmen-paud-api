import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import StudentService from '#services/student_service'
import { inject } from '@adonisjs/core'
import { errors } from '@adonisjs/lucid'
import { createStudentValidation } from '#validators/student/create_student'
import { DateTime } from 'luxon'
import { updateStudentValidation } from '#validators/student/update_student'

@inject()
export default class StudentController {
  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private responseService: ResponseService
  ) {}

  async index({ auth, request, response }: HttpContext) {
    const page = request.input('page')
    const limit = request.input('limit')
    const searchQuery = request.input('q')
    const classId = request.input('class')
    const sortOrder = request.input('sort-order')

    try {
      const user = await this.authService.getUserFromAuth(auth)
      const students = await this.studentService.getTeacherStudents(
        user,
        searchQuery,
        classId,
        page,
        limit,
        sortOrder
      )
      return this.responseService.successResponse(response, 'Data murid berhasil diambil', students)
    } catch (error) {
      return this.responseService.errorResponse(response)
    }
  }

  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createStudentValidation)
    const user = await this.authService.getUserFromAuth(auth)
    const data = {
      ...payload,
      dateOfBirth: DateTime.fromFormat(payload.dateOfBirth, 'yyyy-MM-dd'),
      acceptanceDate: DateTime.fromFormat(payload.acceptanceDate, 'yyyy-MM-dd'),
    }

    try {
      const assessment = await this.studentService.addStudent(data, user)

      return this.responseService.successResponse(
        response,
        'Murid berhasil ditambah',
        assessment,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }

  async getStudentInfo({ request, response }: HttpContext) {
    const id = request.param('id')

    try {
      const data = await this.studentService.getStudentInfo(id)
      return this.responseService.successResponse(response, 'Info siswa berhasil diambil', data)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async update({ auth, request, response }: HttpContext) {
    const id = request.param('id')
    const payload = await request.validateUsing(updateStudentValidation)
    const user = await this.authService.getUserFromAuth(auth)

    const data = {
      ...payload,
      dateOfBirth: payload.dateOfBirth
        ? DateTime.fromFormat(payload.dateOfBirth, 'yyyy-MM-dd')
        : undefined,
      acceptanceDate: payload.acceptanceDate
        ? DateTime.fromFormat(payload.acceptanceDate, 'yyyy-MM-dd')
        : undefined,
    }

    try {
      const assessment = await this.studentService.editStudent(id, data, user)

      return this.responseService.successResponse(
        response,
        'Murid berhasil diperbarui',
        assessment,
        200
      )
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.failResponse(response, error.message)
    }
  }

  async destroy({ auth, request, response }: HttpContext) {
    const id = request.param('id')
    const user = await this.authService.getUserFromAuth(auth)

    try {
      await this.studentService.deleteStudent(id, user)
      return this.responseService.successResponse(response, 'Murid berhasil dihapus')
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }
}
