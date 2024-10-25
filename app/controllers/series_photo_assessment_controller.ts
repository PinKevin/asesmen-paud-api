import ResponseService from '#services/response_service'
import { createSeriesPhotoValidation } from '#validators/photo_series/create_photo_series'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'
import SeriesPhotoAssessmentService from '#services/series_photo_assessment_service'

@inject()
export default class SeriesPhotoAssessmentsController {
  constructor(
    private seriesPhotoService: SeriesPhotoAssessmentService,
    private responseService: ResponseService
  ) {}

  async index({ request, params, response }: HttpContext) {
    const { id } = params
    const page = request.input('page')
    const limit = request.input('limit')
    const startDate = request.input('from')
    const endDate = request.input('until')
    const sortOrder = request.input('sort-order')

    try {
      const data = await this.seriesPhotoService.getAllAssessments(
        id,
        page,
        limit,
        startDate,
        endDate,
        sortOrder
      )
      return this.responseService.successResponse(
        response,
        'Penilaian foto berseri berhasil diambil',
        data
      )
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async store({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const payload = await request.validateUsing(createSeriesPhotoValidation)

    const data = {
      studentId,
      photos: payload.photos,
      description: payload.description,
      feedback: payload.feedback,
      learningGoals: payload.learningGoals,
    }

    try {
      const assessment = await this.seriesPhotoService.addAssessment(data)

      return this.responseService.successResponse(
        response,
        'Foto berseri berhasil ditambah',
        assessment,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }
}
