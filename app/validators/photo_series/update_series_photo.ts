import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateSeriesPhotoValidation = vine.compile(
  vine.object({
    description: vine.string().trim().optional(),
    feedback: vine.string().trim().optional(),
    learningGoals: vine.array(vine.number()).optional(),
    photoLinks: vine.array(vine.string().trim()).minLength(3).maxLength(5).optional(),
  })
)

const messages = {
  'required': '{{ field }} harus diisi',
  'array': '{{ field }} harus berupa array',
  'number': '{{ field }} harus terdiri atas angka',
  'notEmpty': '{{ field }} tidak boleh kosong',
  'array.minLength': '{{ field }} harus diisi minimal {{ min }} anggota',
  'array.maxLength': '{{ field }} harus diisi maksimal {{ max }} anggota',
}

const fields = {
  description: 'Deskripsi',
  feedback: 'Umpan balik',
  learningGoals: 'Tujuan pembelajaran',
  photoLinks: 'Foto-foto',
}

updateSeriesPhotoValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
