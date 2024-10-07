import { LoginDto } from '#dto/auth_dto'
import { AccountStatus } from '#enum/user_enum'
import User from '#models/user'

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
}
