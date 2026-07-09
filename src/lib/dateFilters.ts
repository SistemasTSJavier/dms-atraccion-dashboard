export interface DateFilterState {
  year: number | null
  month: number | null
  week: number | null
  day: number | null
}

export const EMPTY_DATE_FILTER: DateFilterState = {
  year: null,
  month: null,
  week: null,
  day: null,
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export function matchesDateFilter(date: Date, filter: DateFilterState): boolean {
  if (filter.year !== null && date.getFullYear() !== filter.year) return false
  if (filter.month !== null && date.getMonth() + 1 !== filter.month) return false
  if (filter.week !== null && getISOWeek(date) !== filter.week) return false
  if (filter.day !== null && date.getDate() !== filter.day) return false
  return true
}

export function extractYears(dates: Date[]): number[] {
  return [...new Set(dates.map((d) => d.getFullYear()))].sort((a, b) => b - a)
}

export function extractMonths(dates: Date[], year: number | null): number[] {
  const filtered = year !== null ? dates.filter((d) => d.getFullYear() === year) : dates
  return [...new Set(filtered.map((d) => d.getMonth() + 1))].sort((a, b) => a - b)
}

export function extractWeeks(dates: Date[], year: number | null, month: number | null): number[] {
  let filtered = dates
  if (year !== null) filtered = filtered.filter((d) => d.getFullYear() === year)
  if (month !== null) filtered = filtered.filter((d) => d.getMonth() + 1 === month)
  return [...new Set(filtered.map((d) => getISOWeek(d)))].sort((a, b) => a - b)
}

export function extractDays(dates: Date[], year: number | null, month: number | null, week: number | null): number[] {
  let filtered = dates
  if (year !== null) filtered = filtered.filter((d) => d.getFullYear() === year)
  if (month !== null) filtered = filtered.filter((d) => d.getMonth() + 1 === month)
  if (week !== null) filtered = filtered.filter((d) => getISOWeek(d) === week)
  return [...new Set(filtered.map((d) => d.getDate()))].sort((a, b) => a - b)
}

export function monthLabel(month: number): string {
  return MONTHS[month - 1] ?? String(month)
}

export function formatFilterLabel(filter: DateFilterState): string {
  const parts: string[] = []
  if (filter.year) parts.push(String(filter.year))
  if (filter.month) parts.push(monthLabel(filter.month))
  if (filter.week) parts.push(`Semana ${filter.week}`)
  if (filter.day) parts.push(`Día ${filter.day}`)
  return parts.length > 0 ? parts.join(' · ') : 'Todos los periodos'
}
