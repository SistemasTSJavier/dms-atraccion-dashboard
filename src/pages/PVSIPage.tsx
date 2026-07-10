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
import { ChartColorLegend, ChartTooltipContent } from '../components/ChartLegend'
import { DateFilter } from '../components/DateFilter'
import { ChartCard, PageHeader, StatCard } from '../components/ui'
import { useData } from '../context/DataContext'
import { BAR_LABEL_RIGHT, SERIES_COLORS } from '../lib/chartConfig'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { MARGIN_H_PVSI } from '../lib/chartHelpers'

const LEGEND = [
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
]

export function PVSIPage() {
  const { data } = useData()
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)

  const allDates = useMemo(() => data?.reclutadores.map((r) => r.fecha) ?? [], [data])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.reclutadores.filter((r) => matchesDateFilter(r.fecha, dateFilter))
  }, [data, dateFilter])

  if (!data) return null

  const totalIngresos = filtered.reduce((s, r) => s + r.ingresos, 0)
  const totalProcesos = filtered.reduce((s, r) => s + r.procesos, 0)

  const chartData = [
    { metric: 'Ingresos', value: totalIngresos, fill: SERIES_COLORS.ingresos },
    { metric: 'Procesos', value: totalProcesos, fill: SERIES_COLORS.procesos },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="PVSI" subtitle={formatFilterLabel(dateFilter)} />

      <DateFilter
        dates={allDates}
        value={dateFilter}
        onChange={setDateFilter}
        fields={['year', 'month']}
        className="mb-3 shrink-0 sm:mb-4"
      />

      <div className="mb-3 grid shrink-0 grid-cols-2 gap-3 sm:mb-4 sm:gap-4">
        <StatCard label="Ingresos" value={totalIngresos} accent="border-brand" />
        <StatCard label="Procesos" value={totalProcesos} accent="border-blue-500" />
      </div>

      <ChartCard title="INGRESOS VS PROCESOS" className="min-h-0 flex-1">
        <ChartColorLegend items={LEGEND} />
        <div className="mx-auto w-full max-w-3xl">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} layout="vertical" margin={MARGIN_H_PVSI} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                dataKey="metric"
                type="category"
                width={80}
                tick={{ fill: '#09124f', fontSize: 13, fontWeight: 700 }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Cantidad" radius={[0, 10, 10, 0]} label={BAR_LABEL_RIGHT} barSize={44}>
                {chartData.map((entry) => (
                  <Cell key={entry.metric} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
