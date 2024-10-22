import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import StudentService from '#services/student_service'
import { inject } from '@adonisjs/core'

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
}
