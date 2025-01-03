import type { HttpContext } from '@adonisjs/core/http'
import AnecdotalAssessmentService from '#services/anecdotal_assessment_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import { errors } from '@adonisjs/lucid'
import { createAnecdotalValidatoion } from '#validators/anecdotal/create_anecdotal'
import { updateAnecdotalValidation } from '#validators/anecdotal/update_anecdotal'

@inject()
export default class AnecdotalAssessmentsController {
  constructor(
    private anecdotalService: AnecdotalAssessmentService,
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
      const data = await this.anecdotalService.getAllAssessments(id, {
        page,
        limit,
        startDate,
        endDate,
        sortOrder,
      })
      return this.responseService.successResponse(
        response,
        'Penilaian anekdot berhasil diambil',
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
    const payload = await request.validateUsing(createAnecdotalValidatoion)

    const data = {
      studentId,
      photoLink: payload.photoLink,
      description: payload.description,
      feedback: payload.feedback,
      learningGoals: payload.learningGoals,
    }

    try {
      const assessment = await this.anecdotalService.addAssessment(data)

      return this.responseService.successResponse(
        response,
        'Anekdot berhasil ditambah',
        assessment,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }

  async show({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const anecdotalId = request.param('anecdotalId')

    try {
      const anecdotal = await this.anecdotalService.getDetailAssessment(studentId, anecdotalId)
      return this.responseService.successResponse(response, 'Anekdot berhasil diambil', anecdotal)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async update({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const anecdotalId = request.param('anecdotalId')
    const payload = await request.validateUsing(updateAnecdotalValidation)

    try {
      const anecdotal = await this.anecdotalService.updateAssessment(
        studentId,
        anecdotalId,
        payload
      )
      return this.responseService.successResponse(response, 'Anekdot berhasil diubah', anecdotal)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async destroy({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const anecdotalId = request.param('anecdotalId')

    try {
      await this.anecdotalService.deleteAssessment(studentId, anecdotalId)
      return this.responseService.successResponse(response, 'Anekdot berhasil dihapus')
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }
}
