import { Gender, Religion } from '#enum/user_enum'

export interface NewUserEmailDto {
  email: string
  password: string
  confirmPassword?: string
}

export interface NewUserId {
  userId: number
}

export interface CompleteNewUserDataDto {
  name: string
  nuptk: string
  placeOfBirth: string
  dateOfBirth: Date
  gender: Gender
  religion: Religion
}
