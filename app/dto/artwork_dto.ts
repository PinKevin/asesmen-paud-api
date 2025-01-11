export interface CreateArtworkDto {
  photoLink: string
  description: string
  feedback: string
  studentId: number
  learningGoals: number[]
}

export interface EditArtworkDto {
  photoLink?: string
  description?: string
  feedback?: string
  studentId?: number
  learningGoals?: number[]
}
