import AuthService from '#services/auth_service'
import ReportPrintHistoryService from '#services/report_print_history_service'
// import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ReportPrintHistoriesController {
  constructor(
    private reportService: ReportPrintHistoryService,
    private authService: AuthService
    // private responseService: ResponseService
  ) {}

  async downloadReport({ auth, request, response }: HttpContext) {
    const studentId = request.param('id')
    const user = await this.authService.getUserFromAuth(auth)

    const wordBuffer = await this.reportService.printReport(studentId, user)
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response.header('Content-Disposition', `attachment; filename=Student_Report_Test.docx`)
    return response.send(wordBuffer)
  }
}
