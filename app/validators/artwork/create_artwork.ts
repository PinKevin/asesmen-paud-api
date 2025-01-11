import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createArtworkValidation = vine.compile(
  vine.object({
    description: vine.string().trim(),
    feedback: vine.string().trim(),
    photoLink: vine.string().trim(),
    learningGoals: vine.array(vine.number()).notEmpty(),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  array: '{{ field }} harus berupa array',
  number: '{{ field }} harus terdiri atas angka',
}

const fields = {
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  learningGoals: 'Tujuan pembelajaran',
  photoLink: 'Foto',
}

createArtworkValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
