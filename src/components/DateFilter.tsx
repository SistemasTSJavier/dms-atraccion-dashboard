import { Calendar } from 'lucide-react'
import {
  EMPTY_DATE_FILTER,
  extractDays,
  extractMonths,
  extractWeeks,
  extractYears,
  monthLabel,
  type DateFilterState,
} from '../lib/dateFilters'
import { cn } from '../lib/utils'

type DateFilterField = 'year' | 'month' | 'week' | 'day'

interface DateFilterProps {
  dates: Date[]
  value: DateFilterState
  onChange: (filter: DateFilterState) => void
  className?: string
  /** Campos visibles. Por defecto: año, mes, semana y día. */
  fields?: DateFilterField[]
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string
  value: number | null
  options: { value: number; label: string }[]
  onChange: (v: number | null) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">{label}</label>
      <select
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={cn(
          'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand',
          'focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <option value="">Todos</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function DateFilter({
  dates,
  value,
  onChange,
  className,
  fields = ['year', 'month', 'week', 'day'],
}: DateFilterProps) {
  const years = extractYears(dates)
  const months = extractMonths(dates, value.year)
  const weeks = extractWeeks(dates, value.year, value.month)
  const days = extractDays(dates, value.year, value.month, value.week)
  const show = (field: DateFilterField) => fields.includes(field)

  const hasActive =
    (show('year') && value.year !== null) ||
    (show('month') && value.month !== null) ||
    (show('week') && value.week !== null) ||
    (show('day') && value.day !== null)

  const update = (patch: Partial<DateFilterState>) => {
    const next = { ...value, ...patch }
    if ('year' in patch && patch.year !== value.year) {
      next.month = null
      next.week = null
      next.day = null
    }
    if ('month' in patch && patch.month !== value.month) {
      next.week = null
      next.day = null
    }
    if ('week' in patch && patch.week !== value.week) {
      next.day = null
    }
    onChange(next)
  }

  const cols =
    fields.length <= 2 ? 'grid-cols-2' : fields.length === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand">
          <Calendar className="h-4 w-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">Filtro por fecha</span>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_DATE_FILTER)}
            className="text-xs font-medium text-brand/60 hover:text-brand"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className={cn('grid gap-3', cols)}>
        {show('year') && (
          <SelectField
            label="Año"
            value={value.year}
            options={years.map((y) => ({ value: y, label: String(y) }))}
            onChange={(y) => update({ year: y })}
          />
        )}
        {show('month') && (
          <SelectField
            label="Mes"
            value={value.month}
            options={months.map((m) => ({ value: m, label: monthLabel(m) }))}
            onChange={(m) => update({ month: m })}
            disabled={months.length === 0}
          />
        )}
        {show('week') && (
          <SelectField
            label="Semana"
            value={value.week}
            options={weeks.map((w) => ({ value: w, label: `Semana ${w}` }))}
            onChange={(w) => update({ week: w })}
            disabled={weeks.length === 0}
          />
        )}
        {show('day') && (
          <SelectField
            label="Día"
            value={value.day}
            options={days.map((d) => ({ value: d, label: String(d) }))}
            onChange={(d) => update({ day: d })}
            disabled={days.length === 0}
          />
        )}
      </div>
    </div>
  )
}
