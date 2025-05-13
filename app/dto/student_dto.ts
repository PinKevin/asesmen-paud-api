import { Gender, Religion } from '#enum/user_enum'
import { DateTime } from 'luxon'

export interface CreateStudentDto {
  name: string
  nisn: string
  placeOfBirth: string
  dateOfBirth: DateTime
  gender: Gender
  religion: Religion
  acceptanceDate: DateTime
  photoProfileLink: string
  classId: number
}

export interface EditStudentDto {
  name?: string
  nisn?: string
  placeOfBirth?: string
  dateOfBirth?: DateTime
  gender?: Gender
  religion?: Religion
  acceptanceDate?: DateTime
  photoProfileLink?: string
  classId: number
}
