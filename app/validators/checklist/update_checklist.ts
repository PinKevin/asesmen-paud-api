import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const updateChecklistValidation = vine.compile(
  vine.object({
    checklistPoints: vine
      .array(
        vine.object({
          learningGoalId: vine.number(),
          context: vine.string().trim(),
          observedEvent: vine.string().trim(),
          hasAppeared: vine.boolean(),
        })
      )
      .optional(),
  })
)

const messages = {
  required: '{{ field }} harus diisi',
  array: '{{ field }} harus berupa array',
  number: '{{ field }} harus terdiri atas angka',
  notEmpty: '{{ field }} tidak boleh kosong',
  boolean: '{{ field }} harus berupa nilai boolean',
}

const fields = {
  learningGoalId: 'Tujuan pembelajaran',
  context: 'Konteks kejadian',
  observedEvent: 'Kejadian yang teramati',
  hasAppeared: 'Sudah muncul pada anak',
}

updateChecklistValidation.messagesProvider = new SimpleMessagesProvider(messages, fields)
