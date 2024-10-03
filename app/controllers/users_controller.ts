import type { HttpContext } from '@adonisjs/core/http'
import UsersService from '#services/users_service'
import { inject } from '@adonisjs/core'
import { UserDto } from '#models/user'
import { createUserValidator } from '#validators/user/create_user'

@inject()
export default class UsersController {
  constructor(private usersService: UsersService) {}

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 5

    const allUsers = await this.usersService.selectAll(page, limit)
    const result = {
      status: 'success',
      payload: allUsers,
    }

    return result
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const newUser: UserDto = {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    }

    const user = await this.usersService.insert(newUser)
    const result = {
      status: 'success',
      payload: user,
    }

    return response.status(201).json(result)
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await this.usersService.selectWithId(params.id)

      return {
        status: 'success',
        data: {
          fullName: user.fullName,
          email: user.email,
        },
      }
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan',
        })
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

      return response.status(200).json({
        status: 'success',
        data: updatedUser,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan',
        })
      }

      return response.status(400).json({
        status: 'error',
        message: 'Gagal mengubah user',
        error,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.usersService.delete({ id: params.id })

      return response.status(200).json({
        status: 'success',
        message: 'User berhasil dihapus',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).json({
          status: 'error',
          message: 'User tidak ditemukan',
        })
      }

      return response.status(400).json({
        status: 'error',
        message: 'Gagal menghapus user',
      })
    }
  }
}
