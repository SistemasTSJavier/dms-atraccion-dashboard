import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CategoryColorLegend, ChartTooltipContent } from '../components/ChartLegend'
import { DateFilter } from '../components/DateFilter'
import { ChartCard, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useChartHeight } from '../hooks/useChartHeight'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { BAR_LABEL_RIGHT, CATEGORY_COLORS, CHART_MARGIN_VERTICAL } from '../lib/chartConfig'

export function DescartadosPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)
  const chartHeight = useChartHeight(400)

  const allDates = useMemo(() => data?.descartados.map((d) => d.fecha) ?? [], [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.descartados.filter((d) => matchesDateFilter(d.fecha, dateFilter))
  }, [data, dateFilter])

  const chartData = useMemo(() => {
    const grouped = new Map<string, number>()
    for (const d of filtered) {
      grouped.set(d.tipo, (grouped.get(d.tipo) ?? 0) + d.candidatos)
    }
    return [...grouped.entries()].map(([tipo, candidatos]) => ({ tipo, candidatos }))
  }, [filtered])

  const legendItems = useMemo(
    () => chartData.map((d, i) => ({
      label: d.tipo,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    })),
    [chartData],
  )

  if (!data) return null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Descartados" subtitle={formatFilterLabel(dateFilter)} />
      <DateFilter dates={allDates} value={dateFilter} onChange={setDateFilter} className="mb-3 shrink-0 sm:mb-4" />

      {chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-white p-8 text-center text-slate-400 shadow-sm">
          No hay datos para el periodo seleccionado
        </div>
      ) : (
        <ChartCard title="DESCARTADOS">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData} layout="vertical" margin={CHART_MARGIN_VERTICAL}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="tipo" type="category" width={130} tick={{ fill: '#09124f', fontSize: 10, fontWeight: 600 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="candidatos" name="Candidatos" radius={[0, 8, 8, 0]} label={BAR_LABEL_RIGHT}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <CategoryColorLegend items={legendItems} />
        </ChartCard>
      )}
    </div>
  )
}
