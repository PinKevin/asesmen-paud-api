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

    const currentDate = DateTime.now()
    const startDate =
      request.input('start-date') ?? currentDate.startOf('month').toFormat('yyyy-LL-dd')
    const endDate = request.input('end-date') ?? currentDate.endOf('month').toFormat('yyyy-LL-dd')

    try {
      const existReport = await ReportPrintHistory.query()
        .where('studentId', studentId)
        .where('startReportDate', startDate)
        .andWhere('endReportDate', endDate)
        .first()
      if (existReport) {
        throw new Error('Laporan bulan tersebut sudah dibuat.', { cause: 'already-exists' })
      }

      const disk = drive.use()
      const user = await this.authService.getUserFromAuth(auth)

      const { student, buffer, titleDate } = await this.reportService.printReport(
        studentId,
        user,
        startDate,
        endDate
      )

      const fileName = `Laporan_${student.name}_${titleDate}.docx`
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
      console.log(error)
      if (error.cause === 'already-exists') {
        return this.responseService.failResponse(response, error.message)
      }
      return this.responseService.errorResponse(
        response,
        `Gagal membuat laporan. Error: ${error.message}`
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
      return this.responseService.errorResponse(response, 'Gagal mengunduh laporan')
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
      return this.responseService.errorResponse(response, 'Gagal mengambil laporan')
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
      return this.responseService.errorResponse(response, 'Gagal mengambil laporan yang diminta')
    }
  }

  async destroy({ request, response }: HttpContext) {
    const studentId = request.param('id')
    const reportId = request.param('reportId')

    try {
      await this.reportInfoService.deleteReportHistory(studentId, reportId)
      return this.responseService.successResponse(response, 'Laporan berhasil dihapus')
    } catch (error) {
      if (error instanceof lucidError.E_ROW_NOT_FOUND) {
        return this.responseService.failResponse(response, 'Data tidak ditemukan', 404)
      }
      return this.responseService.errorResponse(response, 'Gagal mengambil laporan yang diminta')
      // return this.responseService.errorResponse(response, error.message)
    }
  }
}
