import { useMemo, useRef, useState } from 'react'
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
import { useChartContainerSize } from '../hooks/useChartContainerSize'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { BAR_LABEL_TOP, SERIES_COLORS } from '../lib/chartConfig'
import {
  columnChartMinWidth,
  formatReclutadorLabel,
  MARGIN_V_LEADS,
  XAXIS_RECLUTADOR,
} from '../lib/chartHelpers'

const LEGEND = [
  { label: 'Asignado', color: SERIES_COLORS.asignado },
  { label: 'Revisado', color: SERIES_COLORS.revisado },
]

function yAxisMax(max: number) {
  return Math.max(Math.ceil(max * 1.18), 5)
}

export function LeadsPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)
  const chartWrapRef = useRef<HTMLDivElement>(null)
  const { width: containerWidth, height: chartHeight } = useChartContainerSize(chartWrapRef, 220)

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

  const chartWidth = columnChartMinWidth(chartData.length, containerWidth)
  const dataMax = chartData.reduce((m, row) => Math.max(m, row.asignado, row.revisado), 0)

  if (!data) return null

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader title="Leads" subtitle={formatFilterLabel(dateFilter)} />
      <DateFilter dates={allDates} value={dateFilter} onChange={setDateFilter} className="mb-2 shrink-0 sm:mb-3" />

      {chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-white p-8 text-center text-slate-400 shadow-sm">
          No hay datos para el periodo seleccionado
        </div>
      ) : (
        <ChartCard title="SEGUIMIENTO DE LEADS" className="min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ChartColorLegend items={LEGEND} />
            <div
              ref={chartWrapRef}
              className="min-h-[220px] flex-1 overflow-x-auto overflow-y-hidden"
            >
              {containerWidth > 0 && (
                <div style={{ width: chartWidth, height: chartHeight }}>
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                      data={chartData}
                      margin={MARGIN_V_LEADS}
                      barCategoryGap="20%"
                      barGap={8}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="reclutador" {...XAXIS_RECLUTADOR} />
                      <YAxis
                        width={36}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        allowDecimals={false}
                        domain={[0, yAxisMax(dataMax)]}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="asignado"
                        name="Asignado"
                        fill={SERIES_COLORS.asignado}
                        radius={[4, 4, 0, 0]}
                        label={BAR_LABEL_TOP}
                        maxBarSize={56}
                      />
                      <Bar
                        dataKey="revisado"
                        name="Revisado"
                        fill={SERIES_COLORS.revisado}
                        radius={[4, 4, 0, 0]}
                        label={BAR_LABEL_TOP}
                        maxBarSize={56}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  )
}
