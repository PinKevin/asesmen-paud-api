import { Gender, Religion } from '#enum/user_enum'
import { uniqueRule } from '#validators/unique'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createStudentValidation = vine.compile(
  vine.object({
    name: vine.string().alpha(),
    nisn: vine.string().use(uniqueRule({ table: 'students', column: 'nisn' })),
    placeOfBirth: vine.string(),
    dateOfBirth: vine.string(),
    gender: vine.enum(Gender),
    religion: vine.enum(Religion),
    acceptanceDate: vine.string(),
    photoProfileLink: vine.string(),
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

createStudentValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
