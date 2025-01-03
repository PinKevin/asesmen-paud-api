export interface CreateAnecdotalDto {
  photoLink: string
  description: string
  feedback: string
  studentId: number
  learningGoals: number[]
}

export interface EditAnecdotalDto {
  photoLink?: string
  description?: string
  feedback?: string
  studentId?: number
  learningGoals?: number[]
}
