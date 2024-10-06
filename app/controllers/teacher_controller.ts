import ResponseService from '#services/response_service'
import TeacherService from '#services/teacher_service'
import { createUserValidator } from '#validators/user/create_user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class TeachersController {
  constructor(
    private responseService: ResponseService,
    private teacherService: TeacherService
  ) {}

  async registerTeacher({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    try {
      const teacherInfo = await this.teacherService.createTeacherUser({
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      })

      return this.responseService.successResponse(
        response,
        'Akun guru berhasil dibuat',
        teacherInfo,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message, 400)
    }
  }
}
