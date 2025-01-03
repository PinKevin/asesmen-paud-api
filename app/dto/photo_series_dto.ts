import { MultipartFile } from '@adonisjs/core/types/bodyparser'

export interface CreateSeriesPhotoDto {
  description: string
  feedback: string
  learningGoals: number[]
  studentId: number
  photos: MultipartFile[]
}

export interface EditSeriesPhotoDto {
  description?: string
  feedback?: string
  learningGoals?: number[]
  studentId?: number
  photos?: MultipartFile[]
}
