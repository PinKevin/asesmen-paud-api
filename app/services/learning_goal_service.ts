import Competency from '#models/competency'
import LearningGoal from '#models/learning_goal'
import LearningScope from '#models/learning_scope'
import SubLearningScope from '#models/sub_learning_scope'

export default class LearningGoalService {
  async getCompetencies() {
    const competencies = await Competency.all()
    return competencies
  }

  async getLearningScopes(competencyId: number) {
    const learningScopes = await LearningScope.findManyBy('competency_id', competencyId)
    return learningScopes
  }

  async getSubLearningScopes(learningScopeId: number) {
    const subLearningScopes = await SubLearningScope.findManyBy(
      'learning_scope_id',
      learningScopeId
    )
    return subLearningScopes
  }

  async getLearningGoals(subLearningScopeId: number) {
    const learningGoals = await LearningGoal.findManyBy('sub_learning_scope_id', subLearningScopeId)
    return learningGoals
  }

  async getLearningGoalById(learningGoalId: number) {
    const learningGoal = await LearningGoal.findOrFail(learningGoalId)
    return learningGoal
  }
}
