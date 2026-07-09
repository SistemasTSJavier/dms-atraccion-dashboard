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
import { ChartCard, PageHeader, StatCard } from '../components/ui'
import { useData } from '../context/DataContext'
import { useChartHeight } from '../hooks/useChartHeight'
import { BAR_LABEL_RIGHT, BAR_LABEL_TOP, CHART_MARGIN, SERIES_COLORS } from '../lib/chartConfig'

const LEGEND = [
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
]

export function PVSIPage() {
  const { data } = useData()
  const chartHeight = useChartHeight(300)

  if (!data) return null

  const totalIngresos = data.reclutadores.reduce((s, r) => s + r.ingresos, 0)
  const totalProcesos = data.reclutadores.reduce((s, r) => s + r.procesos, 0)

  const verticalData = [
    { metric: 'Ingresos', value: totalIngresos, fill: SERIES_COLORS.ingresos },
    { metric: 'Procesos', value: totalProcesos, fill: SERIES_COLORS.procesos },
  ]

  const groupedData = [{ name: 'Total', ingresos: totalIngresos, procesos: totalProcesos }]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="PVSI" subtitle="Ingresos vs Procesos" />

      <div className="mb-3 grid shrink-0 grid-cols-2 gap-3 sm:mb-4 sm:gap-4">
        <StatCard label="Ingresos" value={totalIngresos} accent="border-brand" />
        <StatCard label="Procesos" value={totalProcesos} accent="border-blue-500" />
      </div>

      <ChartCard title="INGRESOS VS PROCESOS" className="min-h-0 flex-1">
        <ChartColorLegend items={LEGEND} />

        {/* Móvil: barras horizontales — datos completos y legibles */}
        <div className="block md:hidden">
          <ResponsiveContainer width="100%" height={Math.min(chartHeight, 220)}>
            <BarChart data={verticalData} layout="vertical" margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="metric" type="category" width={72} tick={{ fill: '#09124f', fontSize: 12, fontWeight: 700 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Cantidad" radius={[0, 8, 8, 0]} label={BAR_LABEL_RIGHT} barSize={36}>
                {verticalData.map((entry) => (
                  <Cell key={entry.metric} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Escritorio: columnas agrupadas */}
        <div className="hidden md:block">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={groupedData} barGap={24} barCategoryGap="30%" margin={{ ...CHART_MARGIN, bottom: 16, left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#09124f', fontWeight: 700, fontSize: 13 }} />
              <YAxis domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 12 }} width={48} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ingresos" name="Ingresos" fill={SERIES_COLORS.ingresos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} barSize={80} />
              <Bar dataKey="procesos" name="Procesos" fill={SERIES_COLORS.procesos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} barSize={80} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
