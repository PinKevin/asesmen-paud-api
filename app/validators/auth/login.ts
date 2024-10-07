import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  email: '{{ field }} harus berupa email',
}

const fields = {
  email: 'Email',
  password: 'Password',
}

loginValidator.messagesProvider = new SimpleMessagesProvider(messages, fields)
