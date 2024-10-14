import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createAnecdotalValidatoion = vine.compile(
  vine.object({
    photoLink: vine.string().trim(),
    description: vine.string().trim(),
    feedback: vine.string().trim(),
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
  photoLink: 'Foto',
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  learningGoals: 'Tujuan pembelajaran',
}

createAnecdotalValidatoion.messagesProvider = new SimpleMessagesProvider(messages, fields)
