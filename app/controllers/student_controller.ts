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

  async index({ auth, response }: HttpContext) {
    const user = await this.authService.getUserFromAuth(auth)
    const students = await this.studentService.getTeacherStudents(user)
    return this.responseService.successResponse(response, 'Data murid berhasil diambil', students)
  }
}
