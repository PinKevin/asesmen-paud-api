import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateAnecdotalValidation = vine.compile(
  vine.object({
    photo: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'png'],
      })
      .optional(),
    description: vine.string().trim().optional(),
    feedback: vine.string().trim().optional(),
    learningGoals: vine.array(vine.number()).optional(),
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

updateAnecdotalValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
