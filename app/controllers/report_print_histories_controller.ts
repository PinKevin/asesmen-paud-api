import ReportPrintHistory from '#models/report_print_history'
import AuthService from '#services/auth_service'
import ReportInfoService from '#services/report_info_service'
import ReportPrintHistoryService from '#services/report_print_history_service'
import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { errors as lucidError } from '@adonisjs/lucid'
import { DateTime } from 'luxon'

@inject()
export default class ReportPrintHistoriesController {
  constructor(
    private reportService: ReportPrintHistoryService,
    private reportInfoService: ReportInfoService,
    private authService: AuthService,
    private responseService: ResponseService
  ) {}

  async createAndDownloadReport({ auth, request, response }: HttpContext) {
    const studentId = request.param('id')

    const startDate =
      request.input('start-date') ?? DateTime.now().minus({ days: 30 }).toFormat('yyyy-LL-dd')
    const endDate = request.input('end-date') ?? DateTime.now().toFormat('yyyy-LL-dd')

    try {
      const disk = drive.use()
      const user = await this.authService.getUserFromAuth(auth)

      const { student, buffer, formattedStartDate, formattedEndDate } =
        await this.reportService.printReport(studentId, user, startDate, endDate)

      const fileName = `Laporan Pembelajaran ${student.name} tanggal ${formattedStartDate}-${formattedEndDate}.docx`
      const filePath = `reports/${fileName}`
      await disk.put(filePath, buffer)

      await ReportPrintHistory.create({
        studentId,
        startReportDate: DateTime.fromFormat(startDate, 'yyyy-LL-dd'),
        endReportDate: DateTime.fromFormat(endDate, 'yyyy-LL-dd'),
        printFileLink: filePath,
      })

      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      response.header('Content-Disposition', `attachment; filename=${fileName}`)
      return response.send(buffer)
    } catch (error) {
      return this.responseService.failResponse(
        response,
        'Error saat membuat laporan' + error.message
      )
    }
  }

  async downloadExistingReport({ request, response }: HttpContext) {
    const reportId = request.param('reportId')

    try {
      const disk = drive.use()
      const report = await ReportPrintHistory.firstOrFail(reportId)

      const filePath = report.printFileLink
      const fileExists = disk.exists(filePath)

      if (!fileExists) {
        throw Error('File tidak ditemukan', { cause: 'File not found' })
      }

      const fileStream = await disk.getStream(filePath)
      response.header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      response.header('Content-Disposition', `attachment; filename=${filePath.split('/').pop()}`)
      return response.stream(fileStream)
    } catch (error) {
      if (error instanceof lucidError.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, 'Data tidak ditemukan', 404)
      } else if (error.cause === 'File not found') {
        return this.responseService.failResponse(response, 'File tidak ditemukan', 404)
      }
    }
  }

  async indexReport({ request, response }: HttpContext) {
    const studentId = request.param('id')

    const page = request.input('page')
    const limit = request.input('limit')
    const startDate = request.input('from')
    const endDate = request.input('until')
    const sortOrder = request.input('sort-order')

    try {
      const data = await this.reportInfoService.getAllStudentReportHistory(studentId, {
        page,
        limit,
        startDate,
        endDate,
        sortOrder,
      })
      return this.responseService.successResponse(response, 'Laporan berhasil diambil', data)
    } catch (error) {
      return this.responseService.errorResponse(response)
    }
  }

  async showReport({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const reportId = request.param('reportId')

    try {
      const data = await this.reportInfoService.getStudentReportHistoryById(studentId, reportId)
      return this.responseService.successResponse(response, 'Laporan berhasil diambil', data)
    } catch (error) {
      if (error instanceof lucidError.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, 'Data tidak ditemukan', 404)
      }
      return this.responseService.errorResponse(response)
    }
  }
}
