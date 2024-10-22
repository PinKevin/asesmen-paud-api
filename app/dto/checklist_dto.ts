export interface CreateChecklistDto {
  studentId: number
  checklistPoints: {
    learningGoalId: number
    context: string
    observedEvent: string
    hasAppeared: boolean
  }[]
}

export interface EditChecklistDto {
  studentId?: number
  checklistPoints?: {
    learningGoalId: number
    context: string
    observedEvent: string
    hasAppeared: boolean
  }[]
}
