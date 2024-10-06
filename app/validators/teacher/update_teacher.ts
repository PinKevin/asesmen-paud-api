import { Gender, Religion } from '#enum/user_enum'
import { uniqueRule } from '#validators/unique'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateTeacherValidation = vine.compile(
  vine.object({
    name: vine.string().trim(),
    nuptk: vine
      .string()
      .trim()
      .fixedLength(16)
      .use(uniqueRule({ table: 'teachers', column: 'nuptk' })),
    placeOfBirth: vine.string().trim(),
    dateOfBirth: vine.date(),
    gender: vine.enum(Gender),
    religion: vine.enum(Religion),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  fixedLength: '{{ field }} harus terdiri atas {{ size }} karakter',
  date: '{{ field }} harus berupa tanggal',
  string: '{{ field }} harus berupa string',
  enum: '{{ field }} tidak valid',
}

const fields = {
  name: 'Nama',
  nuptk: 'NUPTK',
  placeOfBirth: 'Tempat lahir',
  dateOfBirth: 'Tanggal lahir',
  gender: 'Jenis kelamin',
  religion: 'Agama',
}

updateTeacherValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
