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
import { BAR_LABEL_TOP, CHART_MARGIN } from '../lib/chartConfig'

const COLORS = { citados: '#748ffc', procesos: '#3b5bdb', ingresos: '#09124f' }

export function MensualPage() {
  const { data } = useData()
  if (!data) return null

  const chartData = data.reclutadores.map((r) => ({
    reclutador: r.reclutador,
    citados: r.citados,
    procesos: r.procesos,
    ingresos: r.ingresos,
  }))

  return (
    <div>
      <PageHeader title="Mensual Reclutador" subtitle="Citados vs Ingresos por reclutador" />
      <ChartCard title="CITADOS VS INGRESOS POR RECLUTADOR">
        <ResponsiveContainer width="100%" height={480}>
          <BarChart data={chartData} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="reclutador" tick={{ fill: '#09124f', fontSize: 11, fontWeight: 600 }} />
            <YAxis tick={{ fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="citados" name="Citados" fill={COLORS.citados} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="procesos" name="Procesos" fill={COLORS.procesos} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
            <Bar dataKey="ingresos" name="Ingresos" fill={COLORS.ingresos} radius={[4, 4, 0, 0]} label={BAR_LABEL_TOP} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
