import { Gender, Religion } from '#enum/user_enum'
import { uniqueRule } from '#validators/unique'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateStudentValidation = vine.compile(
  vine.object({
    name: vine.string().alpha().optional(),
    nisn: vine
      .string()
      .use(uniqueRule({ table: 'students', column: 'nisn' }))
      .optional(),
    placeOfBirth: vine.string().optional(),
    dateOfBirth: vine.string().optional(),
    gender: vine.enum(Gender).optional(),
    religion: vine.enum(Religion).optional(),
    acceptanceDate: vine.string().optional(),
    photoProfileLink: vine.string().optional(),
    classId: vine.number(),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  number: '{{ field }} harus berupa angka',
  alpha: '{{ field }} harus berupa alfabet saja',
  date: '{{ field }} harus berupa tanggal',
  enum: '{{ field }} tidak valid',
}

const fields = {
  name: 'Nama',
  nisn: 'NISN',
  placeOfBirth: 'Tempat lahir',
  dateOfBirth: 'Tanggal Lahir',
  gender: 'Gender',
  religion: 'Agama',
  acceptanceDate: 'Tanggal Diterima',
  photoProfileLink: 'Foto Profil',
}

updateStudentValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
