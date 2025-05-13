import { GetAllAssessmentsOptions } from '#dto/get_all_options'
import ReportPrintHistory from '#models/report_print_history'
import { DateTime } from 'luxon'

export default class ReportInfoService {
  async getSemesterInfo() {
    const currentMonth = DateTime.now().month
    const isEvenSemester = currentMonth >= 1 && currentMonth <= 6
    const currentYear = DateTime.now().year
    const semesterStartYear = isEvenSemester ? currentYear - 1 : currentYear

    const semester = {
      isEvenSemester,
      startYear: semesterStartYear,
      endYear: semesterStartYear + 1,
    }

    return semester
  }

  async getAllStudentReportHistory(studentId: number, options: GetAllAssessmentsOptions = {}) {
    const {
      page = 1,
      limit = 10,
      startDate = DateTime.now().startOf('year').toFormat('yyyy-LL-dd'),
      endDate = DateTime.now().endOf('year').toFormat('yyyy-LL-dd'),
      sortOrder = 'desc',
      usePagination = true,
    } = options

    const startDateTime = DateTime.fromISO(startDate).set({ hour: 0, minute: 0, second: 0 }).toSQL()
    const endDateTime = DateTime.fromISO(endDate).set({ hour: 23, minute: 59, second: 59 }).toSQL()

    const reportsQuery = ReportPrintHistory.query()
      .where('studentId', studentId)
      .whereBetween('startReportDate', [startDateTime!, endDateTime!])
      .whereBetween('endReportDate', [startDateTime!, endDateTime!])
      .orderBy('created_at', sortOrder)

    const reports = usePagination ? await reportsQuery.paginate(page, limit) : await reportsQuery

    return reports
  }

  async getStudentReportHistoryById(studentId: number, reportId: number) {
    const report = await ReportPrintHistory.query()
      .where('studentId', studentId)
      .andWhere('reportId', reportId)
      .firstOrFail()
    return report
  }
}
