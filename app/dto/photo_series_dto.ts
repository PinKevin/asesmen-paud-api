export interface CreateSeriesPhotoDto {
  description: string
  feedback: string
  learningGoals: number[]
  studentId: number
  photoLinks: string[]
}

export interface EditSeriesPhotoDto {
  description?: string
  feedback?: string
  learningGoals?: number[]
  studentId?: number
  photoLinks?: string[]
}
