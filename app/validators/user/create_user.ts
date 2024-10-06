import { uniqueRule } from '#validators/unique'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().trim().minLength(8).confirmed({
      confirmationField: 'confirmPassword',
    }),
    confirmPassword: vine.string().trim(),
  })
)

const messages = {
  'required': '{{ field }} harus diisi',
  'minLength': '{{ field }} harus terdiri atas {{ min }} karakter',
  'email': '{{ field }} harus berupa email',
  'password.confirmed': 'Konfirmasi password harus sama',
}

const fields = {
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Konfirmasi password',
}

createUserValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
