import factory from '@adonisjs/lucid/factories'
import Student from '#models/student'
import { DateTime } from 'luxon'
import { Gender, Religion } from '#enum/user_enum'

export const StudentFactory = factory
  .define(Student, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      nisn: faker.string.numeric(10),
      placeOfBirth: faker.location.city(),
      dateOfBirth: DateTime.fromJSDate(
        faker.date.between({ from: '2019-01-01', to: '2021-12-31' })
      ),
      gender: faker.helpers.arrayElement(Object.values(Gender)),
      religion: faker.helpers.arrayElement(Object.values(Religion)),
      acceptanceDate: DateTime.fromJSDate(
        faker.date.between({ from: '2022-01-01', to: '2024-07-31' })
      ),
      photoProfileLink: 'seeded',
    }
  })
  .build()
