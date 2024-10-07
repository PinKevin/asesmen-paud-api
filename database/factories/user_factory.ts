import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { AccountStatus } from '#enum/user_enum'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email().toLowerCase(),
      password: '12345678',
      accountStatus: AccountStatus.active,
    }
  })
  .build()
