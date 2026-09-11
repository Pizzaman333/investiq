const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const

export function getTodayIsoDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function getMonthKey(date: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date.slice(0, 7)
  }

  const displayMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date)
  return displayMatch ? `${displayMatch[3]}-${displayMatch[2]}` : ''
}

export function getCurrentMonthKey() {
  return getMonthKey(getTodayIsoDate())
}

export function getMonthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex] ?? ''
}

export function formatDateForDisplay(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  return match ? `${match[3]}.${match[2]}.${match[1]}` : date
}

export function getPeriodInfo(monthKey: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey)
  const monthIndex = match ? Number(match[2]) - 1 : -1

  return {
    monthKey,
    month: getMonthName(monthIndex),
    year: match?.[1] ?? '',
  }
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey)

  if (!match) {
    return monthKey
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1 + delta, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}
