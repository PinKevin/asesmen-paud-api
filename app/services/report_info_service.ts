import SchoolYear from '#models/school_year'
import { DateTime } from 'luxon'

export default class ReportInfoService {
  async getSemesterInfo() {
    const currentYear = DateTime.now().year
    const currentMonth = DateTime.now().month
    const isEvenSemester = currentMonth >= 1 && currentMonth <= 6

    const semester = await SchoolYear.query()
      .where('isEvenSemester', isEvenSemester)
      .andWhere('startYear', currentYear)
      .andWhere('endYear', currentYear + 1)
      .firstOrFail()

    return semester
  }
}
