export type AnalyticsRange = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export function parseDateRange(
  range: AnalyticsRange,
  from?: string | null,
  to?: string | null
): { startDate: Date; endDate: Date } {
  const endDate = to ? new Date(to) : new Date()
  endDate.setHours(23, 59, 59, 999)

  if (from) {
    const startDate = new Date(from)
    startDate.setHours(0, 0, 0, 0)
    return { startDate, endDate }
  }

  const startDate = new Date(endDate)
  startDate.setHours(0, 0, 0, 0)

  switch (range) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 30)
      break
    case 'weekly':
      startDate.setDate(startDate.getDate() - 84)
      break
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 12)
      break
    case 'quarterly':
      startDate.setMonth(startDate.getMonth() - 24)
      break
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 5)
      break
    default:
      startDate.setMonth(startDate.getMonth() - 12)
  }

  return { startDate, endDate }
}

export function getDateGroupFormat(range: AnalyticsRange): string {
  switch (range) {
    case 'daily':
      return '%Y-%m-%d'
    case 'weekly':
      return '%Y-W%V'
    case 'monthly':
      return '%Y-%m'
    case 'yearly':
      return '%Y'
    default:
      return '%Y-%m'
  }
}

/** MongoDB $group _id expression for time-series bucketing */
export function getDateGroupId(range: AnalyticsRange, dateField = '$createdAt'): Record<string, unknown> {
  if (range === 'quarterly') {
    return {
      $concat: [
        { $toString: { $year: dateField } },
        '-Q',
        {
          $toString: {
            $ceil: { $divide: [{ $month: dateField }, 3] },
          },
        },
      ],
    }
  }

  return { $dateToString: { format: getDateGroupFormat(range), date: dateField } }
}

export function parseReportDateRange(
  from?: string | null,
  to?: string | null
): { startDate?: Date; endDate?: Date } {
  if (!from && !to) return {}

  const result: { startDate?: Date; endDate?: Date } = {}
  if (from) {
    const startDate = new Date(from)
    startDate.setHours(0, 0, 0, 0)
    result.startDate = startDate
  }
  if (to) {
    const endDate = new Date(to)
    endDate.setHours(23, 59, 59, 999)
    result.endDate = endDate
  }
  return result
}

export function buildDateFilter(
  startDate?: Date,
  endDate?: Date
): Record<string, unknown> | undefined {
  if (!startDate && !endDate) return undefined
  const filter: Record<string, Date> = {}
  if (startDate) filter.$gte = startDate
  if (endDate) filter.$lte = endDate
  return { createdAt: filter }
}
