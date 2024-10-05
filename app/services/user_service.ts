import User, { UserDto } from '#models/user'

export default class UsersService {
  async selectAll(page: number, limit: number) {
    const users = await User.query().select('fullName', 'email').paginate(page, limit)
    return users
  }

  async insert({ fullName, email, password }: UserDto) {
    const user = await User.create({
      fullName,
      email,
      password,
    })

    return {
      fullName: user.fullName,
      email: user.email,
    }
  }

  async selectWithId(id: number) {
    const user = await User.findOrFail(id)

    return {
      fullName: user.fullName,
      email: user.email,
    }
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
