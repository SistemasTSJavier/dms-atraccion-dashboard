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
import { ChartCard, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useChartHeight } from '../hooks/useChartHeight'
import { BAR_LABEL_TOP, CHART_MARGIN, SERIES_COLORS } from '../lib/chartConfig'

const LEGEND = [
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
]

export function PVSIPage() {
  const { data } = useData()
  const chartHeight = useChartHeight(240)

  if (!data) return null

  const totalIngresos = data.reclutadores.reduce((s, r) => s + r.ingresos, 0)
  const totalProcesos = data.reclutadores.reduce((s, r) => s + r.procesos, 0)
  const chartData = [{ name: 'Total', ingresos: totalIngresos, procesos: totalProcesos }]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="PVSI" subtitle="Ingresos vs Procesos" />
      <ChartCard title="INGRESOS VS PROCESOS">
        <ChartColorLegend items={LEGEND} />
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData} barGap={48} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#09124f', fontWeight: 600, fontSize: 12 }} />
            <YAxis domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="ingresos" name="Ingresos" fill={SERIES_COLORS.ingresos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="procesos" name="Procesos" fill={SERIES_COLORS.procesos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
