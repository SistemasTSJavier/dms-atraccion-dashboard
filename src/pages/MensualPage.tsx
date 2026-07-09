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
import { useRowChartHeight, formatReclutadorLabel, MARGIN_H_RECRUITER, TICK_RECLUTADOR } from '../lib/chartHelpers'
import { BAR_LABEL_RIGHT, SERIES_COLORS } from '../lib/chartConfig'

const LEGEND = [
  { label: 'Citados', color: SERIES_COLORS.citados },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
]

export function MensualPage() {
  const { data } = useData()

  if (!data) return null

  const chartData = data.reclutadores.map((r) => ({
    reclutador: formatReclutadorLabel(r.reclutador),
    citados: r.citados,
    procesos: r.procesos,
    ingresos: r.ingresos,
  }))

  const chartHeight = useRowChartHeight(chartData.length, 58, 260)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Mensual Reclutador" subtitle="Citados vs Ingresos por reclutador" />
      <ChartCard title="CITADOS VS INGRESOS POR RECLUTADOR" className="min-h-0 flex-1">
        <ChartColorLegend items={LEGEND} />
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={MARGIN_H_RECRUITER}
            barCategoryGap="20%"
            barGap={4}
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
            <Bar dataKey="citados" name="Citados" fill={SERIES_COLORS.citados} radius={[0, 4, 4, 0]} label={BAR_LABEL_RIGHT} barSize={12} />
            <Bar dataKey="procesos" name="Procesos" fill={SERIES_COLORS.procesos} radius={[0, 4, 4, 0]} label={BAR_LABEL_RIGHT} barSize={12} />
            <Bar dataKey="ingresos" name="Ingresos" fill={SERIES_COLORS.ingresos} radius={[0, 4, 4, 0]} label={BAR_LABEL_RIGHT} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
