// import { Hash } from '@adonisjs/core/hash'
import User, { UserDto } from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersService {
  async selectAll(page: number, limit: number) {
    const users = await User.query().select('fullName', 'email').paginate(page, limit)
    return users
  }

  async insert({ fullName, email, password }: UserDto) {
    const hashedPassword = await hash.make(password!)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })

    return {
      fullName: user.fullName,
      email: user.email,
    }
  }

  async selectWithId(id: number) {
    const user = await User.findOrFail(id)

    return user
  }

  async update({ id, fullName }: UserDto) {
    const user = await User.findOrFail(id)

    await user.merge({ fullName }).save()

    return {
      fullName: user.fullName,
    }
  }

  async delete({ id }: UserDto) {
    const user = await User.findOrFail(id)

    await user.delete()
  }
}
