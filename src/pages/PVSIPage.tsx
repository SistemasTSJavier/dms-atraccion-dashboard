import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartCard, PageHeader } from '../components/ui'
import { useData } from '../context/DataContext'
import { useChartHeight } from '../hooks/useChartHeight'
import { BAR_LABEL_TOP, CHART_MARGIN } from '../lib/chartConfig'

const COLORS = { ingresos: '#09124f', procesos: '#3b5bdb' }

export function PVSIPage() {
  const { data } = useData()
  const chartHeight = useChartHeight(200)

  if (!data) return null

  const totalIngresos = data.reclutadores.reduce((s, r) => s + r.ingresos, 0)
  const totalProcesos = data.reclutadores.reduce((s, r) => s + r.procesos, 0)
  const chartData = [{ name: 'Total', ingresos: totalIngresos, procesos: totalProcesos }]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="PVSI" subtitle="Ingresos vs Procesos" />
      <ChartCard title="INGRESOS VS PROCESOS">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={chartData} barGap={40} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#09124f', fontWeight: 600, fontSize: 12 }} />
            <YAxis domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="ingresos" name="Ingresos" fill={COLORS.ingresos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="procesos" name="Procesos" fill={COLORS.procesos} radius={[8, 8, 0, 0]} label={BAR_LABEL_TOP} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
