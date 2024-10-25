import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createSeriesPhotoValidation = vine.compile(
  vine.object({
    photos: vine
      .array(
        vine.file({
          size: '5mb',
          extnames: ['jpg', 'png'],
        })
      )
      .minLength(3)
      .maxLength(5),
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
  'array.minLength': '{{ field }} harus diisi minimal {{ min }} anggota',
  'array.maxLength': '{{ field }} harus diisi maksimal {{ max }} anggota',
}

const fields = {
  photos: 'Foto-foto',
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  learningGoals: 'Tujuan pembelajaran',
}

createSeriesPhotoValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
