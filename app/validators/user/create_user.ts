import { uniqueRule } from '#validators/unique'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(5),
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().trim().minLength(8),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  minLength: '{{ field }} harus terdiri atas {{ min }} karakter',
  email: '{{ field }} harus berupa email',
}

const fields = {
  fullName: 'Nama lengkap',
  email: 'Email',
  password: 'Password',
}

createUserValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
