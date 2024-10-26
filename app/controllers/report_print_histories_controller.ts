import ReportPrintHistoryService from '#services/report_print_history_service'
// import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ReportPrintHistoriesController {
  constructor(
    private reportService: ReportPrintHistoryService
    // private responseService: ResponseService
  ) {}

  async downloadReport({ request, response }: HttpContext) {
    const studentId = request.param('id')

    const wordBuffer = await this.reportService.printReport(studentId)
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename=Student_Report_Test.docx`)
    return response.send(wordBuffer)
  }
}
