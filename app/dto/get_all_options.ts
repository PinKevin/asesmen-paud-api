import { DateTime } from 'luxon'

export interface GetAllAssessmentsOptions {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  sortOrder?: 'asc' | 'desc'
  usePagination?: boolean
}

export const defaultGetAllAssessmentsOptions = {
  page: 1,
  limit: 10,
  startDate: DateTime.now().setZone('Asia/Jakarta').minus({ days: 7 }).toFormat('yyyy-LL-dd'),
  endDate: DateTime.now().setZone('Asia/Jakarta').toFormat('yyyy-LL-dd'),
  sortOrder: 'desc' as 'asc' | 'desc',
  usePagination: true,
}

export function getDateTimeRange(options: GetAllAssessmentsOptions) {
  const startDate = options.startDate || defaultGetAllAssessmentsOptions.startDate
  const endDate = options.endDate || defaultGetAllAssessmentsOptions.endDate

  const startDateTime = DateTime.fromISO(startDate).set({ hour: 0, minute: 0, second: 0 }).toSQL()
  const endDateTime = DateTime.fromISO(endDate).set({ hour: 23, minute: 59, second: 59 }).toSQL()

  return { startDateTime, endDateTime }
}
