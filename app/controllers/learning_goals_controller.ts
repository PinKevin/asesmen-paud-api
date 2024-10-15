import LearningGoalService from '#services/learning_goal_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LearningGoalsController {
  constructor(
    private responseService: ResponseService,
    private learningGoalService: LearningGoalService
  ) {}

  async getAllCompetencies({ response }: HttpContext) {
    const data = await this.learningGoalService.getCompetencies()
    return this.responseService.successResponse(response, 'Kompetensi berhasil diambil', data)
  }

  async getLearningScopesByCompetencyId({ request, response }: HttpContext) {
    const competencyId = request.param('competencyId')
    const data = await this.learningGoalService.getLearningScopes(competencyId)
    return this.responseService.successResponse(
      response,
      'Lingkup pembelajaran berhasil diambil',
      data
    )
  }

  async getSubLearningScopesByLearningScopeId({ request, response }: HttpContext) {
    const learningScopeId = request.param('learningScopeId')
    const data = await this.learningGoalService.getSubLearningScopes(learningScopeId)
    return this.responseService.successResponse(
      response,
      'Sub-lingkup pembelajaran berhasil diambil',
      data
    )
  }

  async getLearningGoalsBySubLearningScopeId({ request, response }: HttpContext) {
    const subLearningScopeId = request.param('subLearningScopeId')
    const data = await this.learningGoalService.getLearningGoals(subLearningScopeId)
    return this.responseService.successResponse(
      response,
      'Tujuan pembelajaran berhasil diambil',
      data
    )
  }
}
