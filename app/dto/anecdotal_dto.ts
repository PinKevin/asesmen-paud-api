import { MultipartFile } from '@adonisjs/core/types/bodyparser'

export interface CreateAnecdotalDto {
  photo: MultipartFile
  description: string
  feedback: string
  studentId: number
  learningGoals: number[]
}
