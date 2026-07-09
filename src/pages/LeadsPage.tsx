import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartColorLegend, ChartTooltipContent } from '../components/ChartLegend'
import { DateFilter } from '../components/DateFilter'
import { ChartCard, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useChartHeight } from '../hooks/useChartHeight'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { BAR_LABEL_TOP, CHART_MARGIN, SERIES_COLORS } from '../lib/chartConfig'

const LEGEND = [
  { label: 'Asignado', color: SERIES_COLORS.asignado },
  { label: 'Revisado', color: SERIES_COLORS.revisado },
]

export function LeadsPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)
  const chartHeight = useChartHeight(380)

  const allDates = useMemo(() => data?.leads.map((l) => l.mes) ?? [], [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.leads.filter((l) => matchesDateFilter(l.mes, dateFilter))
  }, [data, dateFilter])

  const chartData = useMemo(() => {
    const grouped = new Map<string, { asignado: number; revisado: number }>()
    for (const l of filtered) {
      const prev = grouped.get(l.reclutador) ?? { asignado: 0, revisado: 0 }
      grouped.set(l.reclutador, {
        asignado: prev.asignado + l.asignado,
        revisado: prev.revisado + l.revisado,
      })
    }
    return [...grouped.entries()].map(([reclutador, vals]) => ({ reclutador, ...vals }))
  }, [filtered])

  if (!data) return null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Leads" subtitle={formatFilterLabel(dateFilter)} />
      <DateFilter dates={allDates} value={dateFilter} onChange={setDateFilter} className="mb-3 shrink-0 sm:mb-4" />

      {chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-white p-8 text-center text-slate-400 shadow-sm">
          No hay datos para el periodo seleccionado
        </div>
      ) : (
        <ChartCard title="SEGUIMIENTO DE LEADS">
          <ChartColorLegend items={LEGEND} />
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData} margin={CHART_MARGIN} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="reclutador" tick={{ fill: '#09124f', fontSize: 10, fontWeight: 600 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="asignado" name="Asignado" fill={SERIES_COLORS.asignado} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
              <Bar dataKey="revisado" name="Revisado" fill={SERIES_COLORS.revisado} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  )
}
