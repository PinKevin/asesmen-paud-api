import { MultipartFile } from '@adonisjs/core/types/bodyparser'

export interface CreateArtworkDto {
  photo: MultipartFile
  description: string
  feedback: string
  studentId: number
  learningGoals: number[]
}

export interface EditArtworkDto {
  photo?: MultipartFile
  description?: string
  feedback?: string
  studentId?: number
  learningGoals?: number[]
}
