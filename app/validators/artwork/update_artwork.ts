import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateArtworkValidation = vine.compile(
  vine.object({
    description: vine.string().trim().optional(),
    feedback: vine.string().trim().optional(),
    photoLink: vine.string().trim().optional(),
    learningGoals: vine.array(vine.number()).optional(),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  array: '{{ field }} harus berupa array',
  number: '{{ field }} harus terdiri atas angka',
  notEmpty: '{{ field }} tidak boleh kosong',
}

const fields = {
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  photoLink: 'Foto',
  learningGoals: 'Tujuan pembelajaran',
}

updateArtworkValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
