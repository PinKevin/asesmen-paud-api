import type { HttpContext } from '@adonisjs/core/http'
import AnecdotalAssessmentService from '#services/anecdotal_assessment_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import { errors } from '@adonisjs/lucid'

@inject()
export default class AnecdotalAssessmentsController {
  constructor(
    private anecdotalService: AnecdotalAssessmentService,
    private responseService: ResponseService
  ) {}

  async index({ request, params, response }: HttpContext) {
    const { id } = params
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    try {
      const data = await this.anecdotalService.getAllAssessments(id, page, limit)
      return this.responseService.successResponse(
        response,
        'Penilaian asesmen berhasil diambil',
        data
      )
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }
}
