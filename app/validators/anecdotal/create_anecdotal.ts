import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createAnecdotalValidatoion = vine.compile(
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
  notEmpty: '{{ field }} tidak boleh kosong',
}

const fields = {
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  photoLink: 'Foto',
  learningGoals: 'Tujuan pembelajaran',
}

createAnecdotalValidatoion.messagesProvider = new SimpleMessagesProvider(messages, fields)
