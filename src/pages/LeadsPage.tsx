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
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { BAR_LABEL_RIGHT, SERIES_COLORS } from '../lib/chartConfig'
import { formatReclutadorLabel, MARGIN_H_RECRUITER, TICK_RECLUTADOR, useRowChartHeight } from '../lib/chartHelpers'

const LEGEND = [
  { label: 'Asignado', color: SERIES_COLORS.asignado },
  { label: 'Revisado', color: SERIES_COLORS.revisado },
]

export function LeadsPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)

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
    return [...grouped.entries()].map(([reclutador, vals]) => ({
      reclutador: formatReclutadorLabel(reclutador),
      ...vals,
    }))
  }, [filtered])

  const chartHeight = useRowChartHeight(chartData.length, 52, 340)

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
        <ChartCard title="SEGUIMIENTO DE LEADS" className="min-h-0 flex-1">
          <ChartColorLegend items={LEGEND} />
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={MARGIN_H_RECRUITER}
              barCategoryGap="22%"
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis
                dataKey="reclutador"
                type="category"
                width={96}
                tick={TICK_RECLUTADOR}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="asignado" name="Asignado" fill={SERIES_COLORS.asignado} radius={[0, 4, 4, 0]} label={BAR_LABEL_RIGHT} barSize={16} />
              <Bar dataKey="revisado" name="Revisado" fill={SERIES_COLORS.revisado} radius={[0, 4, 4, 0]} label={BAR_LABEL_RIGHT} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  )
}
