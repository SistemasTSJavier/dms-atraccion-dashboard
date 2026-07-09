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
import { BAR_LABEL_TOP, SERIES_COLORS } from '../lib/chartConfig'
import {
  columnChartMinWidth,
  formatReclutadorLabel,
  MARGIN_V_RECRUITER,
  XAXIS_RECLUTADOR,
} from '../lib/chartHelpers'

const LEGEND = [
  { label: 'Asignado', color: SERIES_COLORS.asignado },
  { label: 'Revisado', color: SERIES_COLORS.revisado },
]

export function LeadsPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)
  const chartHeight = useChartHeight(340)

  const allDates = useMemo(() => data?.leads.map((l) => l.mes) ?? [], [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.leads.filter((l) => matchesDateFilter(l.mes, dateFilter))
  }, [data, dateFilter])

  const chartData = useMemo(() => {
    const grouped = new Map<string, { asignado: number; revisado: number }>()
    for (const l of filtered) {
      const key = l.reclutador.toUpperCase()
      const prev = grouped.get(key) ?? { asignado: 0, revisado: 0 }
      grouped.set(key, {
        asignado: prev.asignado + l.asignado,
        revisado: prev.revisado + l.revisado,
      })
    }
    return [...grouped.entries()].map(([reclutador, vals]) => ({
      reclutador: formatReclutadorLabel(reclutador),
      ...vals,
    }))
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
        <ChartCard title="SEGUIMIENTO DE LEADS" className="min-h-0 flex-1">
          <ChartColorLegend items={LEGEND} />
          <div className="min-h-0 flex-1 overflow-x-auto">
            <div className="h-full" style={{ minWidth: columnChartMinWidth(chartData.length) }}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={chartData}
                  margin={MARGIN_V_RECRUITER}
                  barCategoryGap="18%"
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="reclutador" {...XAXIS_RECLUTADOR} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="asignado" name="Asignado" fill={SERIES_COLORS.asignado} radius={[6, 6, 0, 0]} label={BAR_LABEL_TOP} maxBarSize={48} />
                  <Bar dataKey="revisado" name="Revisado" fill={SERIES_COLORS.revisado} radius={[6, 6, 0, 0]} label={BAR_LABEL_TOP} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  )
}
