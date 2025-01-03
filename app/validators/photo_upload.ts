import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const photoValidation = vine.compile(
  vine.object({
    photo: vine.file({
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg', 'heic'],
    }),
  })
)

const messages = {
  'file.size': 'Ukuran file harus di bawah 5 MB',
  'file.extname': 'File harus berformat .jpg, .jpeg, .png, atau .heic',
}

const fields = {
  photo: 'Foto',
}

photoValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
