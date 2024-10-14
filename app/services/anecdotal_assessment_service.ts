import AnecdotalAssessment from '#models/anecdotal_assessment'
import Student from '#models/student'

export default class AnecdotalAssessmentService {
  async getAllAssessments(id: number, page: number, limit: number) {
    const student = await Student.findOrFail(id)

    const anecdotals = await AnecdotalAssessment.query()
      .where('student_id', student.id)
      .preload('learningGoals')
      .paginate(page, limit)

    return anecdotals
  }
}
