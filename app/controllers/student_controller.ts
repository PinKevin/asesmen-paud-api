import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import StudentService from '#services/student_service'
import { inject } from '@adonisjs/core'
import { errors } from '@adonisjs/lucid'

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
}
