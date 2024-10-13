import { LoginDto } from '#dto/auth_dto'
import { AccountStatus } from '#enum/user_enum'
import User from '#models/user'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export default class AuthService {
  async createToken({ email, password }: LoginDto) {
    try {
      const user = await User.verifyCredentials(email, password)

      if (user.accountStatus !== AccountStatus.active) {
        throw Error('Akun Anda belum aktif', { cause: 'pending_account' })
      }

      const token = await User.accessTokens.create(user)

      return token
    } catch (error) {
      throw error
    }
  }

  async revokeToken(auth: Authenticator<Authenticators>) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
  }

  async checkToken(auth: Authenticator<Authenticators>) {
    try {
      const isLoggedIn = await auth.use('api').check()
      return isLoggedIn
    } catch (error) {
      throw error
    }
  }
}
