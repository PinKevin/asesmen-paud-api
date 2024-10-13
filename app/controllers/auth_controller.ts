import AuthService from '#services/auth_service'
import ResponseService from '#services/response_service'
import { loginValidator } from '#validators/auth/login'
import { errors } from '@adonisjs/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(
    private responseService: ResponseService,
    private authService: AuthService
  ) {}

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const token = await this.authService.createToken({
        email,
        password,
      })

      return this.responseService.successResponse(response, 'Anda berhasil login', token)
    } catch (error) {
      if (error.cause === 'pending_account') {
        return this.responseService.failResponse(response, error.message, 400)
      }

      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        return this.responseService.failResponse(response, 'Email atau password salah', 400)
      }

      return this.responseService.errorResponse(response)
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      await this.authService.revokeToken(auth)

      return this.responseService.successResponse(response, 'Anda berhasil keluar')
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }

  async checkAuthenticaton({ auth, response }: HttpContext) {
    try {
      await this.authService.checkToken(auth)
      return this.responseService.successResponse(response, 'Token login user valid')
    } catch (error) {
      return this.responseService.failResponse(response, 'Token kadaluarsa')
    }
  }

  async getProfile({ auth, response }: HttpContext) {
    try {
      const data = await this.authService.getUser(auth)
      return this.responseService.successResponse(response, 'Profil berhasil diambil', data)
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }
}
