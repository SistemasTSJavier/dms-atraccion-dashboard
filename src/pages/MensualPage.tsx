import { useMemo } from 'react'
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
import { BAR_LABEL_TOP, SERIES_COLORS } from '../lib/chartConfig'
import {
  columnChartMinWidth,
  formatReclutadorLabel,
  MARGIN_V_RECRUITER,
  XAXIS_RECLUTADOR,
} from '../lib/chartHelpers'

const LEGEND = [
  { label: 'Citados', color: SERIES_COLORS.citados },
  { label: 'Procesos', color: SERIES_COLORS.procesos },
  { label: 'Ingresos', color: SERIES_COLORS.ingresos },
]

export function MensualPage() {
  const { data } = useData()
  const chartHeight = useChartHeight(260)

  const chartData = useMemo(() => {
    if (!data) return []
    const grouped = new Map<string, { citados: number; procesos: number; ingresos: number }>()
    for (const r of data.reclutadores) {
      const key = r.reclutador.toUpperCase()
      const prev = grouped.get(key) ?? { citados: 0, procesos: 0, ingresos: 0 }
      grouped.set(key, {
        citados: prev.citados + r.citados,
        procesos: prev.procesos + r.procesos,
        ingresos: prev.ingresos + r.ingresos,
      })
    }
    return [...grouped.entries()].map(([reclutador, vals]) => ({
      reclutador: formatReclutadorLabel(reclutador),
      ...vals,
    }))
  }, [data])

  if (!data) return null

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Mensual Reclutador" subtitle="Citados vs Ingresos por reclutador" />
      <ChartCard title="CITADOS VS INGRESOS POR RECLUTADOR" className="min-h-0 flex-1">
        <ChartColorLegend items={LEGEND} />
        <div className="min-h-0 flex-1 overflow-x-auto">
          <div className="h-full" style={{ minWidth: columnChartMinWidth(chartData.length) }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={chartData}
                margin={MARGIN_V_RECRUITER}
                barCategoryGap="16%"
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="reclutador" {...XAXIS_RECLUTADOR} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="citados" name="Citados" fill={SERIES_COLORS.citados} radius={[6, 6, 0, 0]} label={BAR_LABEL_TOP} maxBarSize={40} />
                <Bar dataKey="procesos" name="Procesos" fill={SERIES_COLORS.procesos} radius={[6, 6, 0, 0]} label={BAR_LABEL_TOP} maxBarSize={40} />
                <Bar dataKey="ingresos" name="Ingresos" fill={SERIES_COLORS.ingresos} radius={[6, 6, 0, 0]} label={BAR_LABEL_TOP} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
