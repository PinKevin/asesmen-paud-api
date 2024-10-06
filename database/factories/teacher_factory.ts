import factory from '@adonisjs/lucid/factories'
import Teacher from '#models/teacher'
import { DateTime } from 'luxon'
import { Gender, Religion } from '#enum/user_interface'

export const TeacherFactory = factory
  .define(Teacher, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      nuptk: faker.string.numeric(16),
      placeOfBirth: faker.location.city(),
      dateOfBirth: DateTime.fromJSDate(
        faker.date.between({ from: '1960-01-01', to: '2000-12-31' })
      ),
      gender: faker.helpers.arrayElement(Object.values(Gender)),
      religion: faker.helpers.arrayElement(Object.values(Religion)),
    }
  })
  .build()
