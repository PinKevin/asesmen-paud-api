import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserDto } from '#models/user'
import { createUserValidator } from '#validators/user/create_user'
import UsersService from '#services/user_service'
import ResponseService from '#services/response_service'

@inject()
export default class UsersController {
  constructor(
    private usersService: UsersService,
    private responseService: ResponseService
  ) {}

  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 5

    const allUsers = await this.usersService.selectAll(page, limit)

    return this.responseService.successResponse(response, 'Data user berhasil diambil', allUsers)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const newUser: UserDto = {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    }

    const user = await this.usersService.insert(newUser)

    return this.responseService.successResponse(response, 'User berhasil ditambahkan', user, 201)
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await this.usersService.selectWithId(params.id)

      return this.responseService.successResponse(response, 'Data user berhasil diambil', user)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return this.responseService.failResponse(response, 'User tidak ditemukan', 404)
      }
    }
  }

  async update({ request, params, response }: HttpContext) {
    const payload = request.only(['fullName'])

    try {
      const updatedUser = await this.usersService.update({
        id: params.id,
        fullName: payload.fullName,
      })

      return this.responseService.successResponse(
        response,
        'User berhasil diubah',
        updatedUser,
        201
      )
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return this.responseService.failResponse(response, 'User tidak ditemukan', 404)
      }
      return this.responseService.errorResponse(response)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.usersService.delete({ id: params.id })

      return this.responseService.successResponse(response, 'User berhasil dihapus')
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return this.responseService.failResponse(response, 'User tidak ditemukan', 404)
      }
      return this.responseService.errorResponse(response)
    }
  }
}
