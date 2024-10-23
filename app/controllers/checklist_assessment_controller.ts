import ChecklistAssessmentService from '#services/checklist_assessment_service'
import ResponseService from '#services/response_service'
import { createChecklistValidation } from '#validators/checklist/create_checklist'
import { updateChecklistValidation } from '#validators/checklist/update_checklist'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/lucid'

@inject()
export default class ChecklistAssessmentsController {
  constructor(
    private checklistService: ChecklistAssessmentService,
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
      const data = await this.checklistService.getAllAssessments(
        id,
        page,
        limit,
        startDate,
        endDate,
        sortOrder
      )
      return this.responseService.successResponse(
        response,
        'Penilaian ceklis berhasil diambil',
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
    const payload = await request.validateUsing(createChecklistValidation)

    const data = {
      studentId,
      checklistPoints: payload.checklistPoints,
    }

    try {
      const assessment = await this.checklistService.addAssessment(data)

      return this.responseService.successResponse(
        response,
        'Penilaian ceklis berhasil ditambah',
        assessment,
        201
      )
    } catch (error) {
      return this.responseService.failResponse(response, error.message)
    }
  }

  async show({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const checklistId = request.param('checklistId')

    try {
      const checklist = await this.checklistService.getDetailAssessment(studentId, checklistId)
      return this.responseService.successResponse(response, 'Ceklis berhasil diambil', checklist)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async update({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const checklistId = request.param('checklistId')
    const payload = await request.validateUsing(updateChecklistValidation)

    try {
      const checklist = await this.checklistService.updateAssessment(
        studentId,
        checklistId,
        payload
      )
      return this.responseService.successResponse(response, 'Ceklis berhasil diubah', checklist)
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }

  async destroy({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const checklistId = request.param('checklistId')

    try {
      await this.checklistService.deleteAssessment(studentId, checklistId)
      return this.responseService.successResponse(response, 'Ceklis berhasil dihapus')
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, error.message, 404)
      }

      return this.responseService.errorResponse(response, error.message)
    }
  }
}
