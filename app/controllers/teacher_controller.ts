import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import TeacherService from '#services/teacher_service'
import { updateTeacherValidation } from '#validators/teacher/update_teacher'
import { createUserValidator } from '#validators/user/create_user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'

@inject()
export default class TeacherController {
  constructor(
    private responseService: ResponseService,
    private teacherService: TeacherService,
    private authService: AuthService
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

  async completeTeacherAfterRegister({ request, response }: HttpContext) {
    const teacherId = request.param('id')
    const payload = await request.validateUsing(updateTeacherValidation)

    const teacherData = {
      id: teacherId,
      ...payload,
    }

    try {
      const teacher = await this.teacherService.completeTeacherInfo(teacherData)

      return this.responseService.successResponse(response, 'Anda berhasil mendaftar', teacher, 201)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, 'Tidak ada guru yang ditemukan', 404)
      }

      return this.responseService.failResponse(response, error.message)
    }
  }

  async getTeacherClasses({ auth, response }: HttpContext) {
    const user = await this.authService.getUserFromAuth(auth)
    const classes = await this.teacherService.getTeacherClass(user)
    return this.responseService.successResponse(response, 'Kelas guru berhasil diambil', classes)
  }
}
