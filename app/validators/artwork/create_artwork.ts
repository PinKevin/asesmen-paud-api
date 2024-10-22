import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createArtworkValidation = vine.compile(
  vine.object({
    photo: vine.file({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
    description: vine.string().trim(),
    feedback: vine.string().trim(),
    learningGoals: vine.array(vine.number()).notEmpty(),
  })
)

const messages = {
  'required': '{{ field }} harus diisi',
  'array': '{{ field }} harus berupa array',
  'number': '{{ field }} harus terdiri atas angka',
  'notEmpty': '{{ field }} tidak boleh kosong',
  'file.size': 'Ukuran file harus di bawah 5 MB',
  'file.extname': 'File harus berformat .jpg, .jpeg, atau .png',
}

const fields = {
  photo: 'Foto',
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  learningGoals: 'Tujuan pembelajaran',
}

createArtworkValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
