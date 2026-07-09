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
  { label: 'Citados', color: SERIES_COLORS.citados },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
]

export function MensualPage() {
  const { data } = useData()
  const chartHeight = useChartHeight(260)

  if (!data) return null

  const chartData = data.reclutadores.map((r) => ({
    reclutador: r.reclutador,
    citados: r.citados,
    procesos: r.procesos,
    ingresos: r.ingresos,
  }))

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Mensual Reclutador" subtitle="Citados vs Ingresos por reclutador" />
      <ChartCard title="CITADOS VS INGRESOS POR RECLUTADOR">
        <ChartColorLegend items={LEGEND} />
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData} margin={CHART_MARGIN} barCategoryGap="18%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="reclutador" tick={{ fill: '#09124f', fontSize: 10, fontWeight: 600 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="citados" name="Citados" fill={SERIES_COLORS.citados} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="procesos" name="Procesos" fill={SERIES_COLORS.procesos} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="ingresos" name="Ingresos" fill={SERIES_COLORS.ingresos} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
