import ArtworkAssessmentService from '#services/artwork_assessment_service'
import ResponseService from '#services/response_service'
import { createArtworkValidation } from '#validators/artwork/create_artwork'
import { updateArtworkValidation } from '#validators/artwork/update_artwork'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'

@inject()
export default class ArtworkAssessmentsController {
  constructor(
    private artworkService: ArtworkAssessmentService,
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
      const data = await this.artworkService.getAllAssessments(id, {
        page,
        limit,
        startDate,
        endDate,
        sortOrder,
      })
      return this.responseService.successResponse(
        response,
        'Penilaian hasil karya berhasil diambil',
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
    const payload = await request.validateUsing(createArtworkValidation)

    const data = {
      studentId,
      photoLink: payload.photoLink,
      description: payload.description,
      feedback: payload.feedback,
      learningGoals: payload.learningGoals,
    }

    try {
      const assessment = await this.artworkService.addAssessment(data)

      return this.responseService.successResponse(
        response,
        'Hasil karya berhasil ditambah',
        assessment,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }

  async show({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const artworkId = request.param('artworkId')

    try {
      const artwork = await this.artworkService.getDetailAssessment(studentId, artworkId)
      return this.responseService.successResponse(response, 'Hasil karya berhasil diambil', artwork)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async update({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const artworkId = request.param('artworkId')
    const payload = await request.validateUsing(updateArtworkValidation)

    try {
      const artwork = await this.artworkService.updateAssessment(studentId, artworkId, payload)
      return this.responseService.successResponse(response, 'Hasil karya berhasil diubah', artwork)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async destroy({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const artworkId = request.param('artworkId')

    try {
      await this.artworkService.deleteAssessment(studentId, artworkId)
      return this.responseService.successResponse(response, 'Hasil karya berhasil dihapus')
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }
}
