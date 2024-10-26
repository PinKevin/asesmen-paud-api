export interface GetAllAssessmentsOptions {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  sortOrder?: 'asc' | 'desc'
  usePagination?: boolean
}
