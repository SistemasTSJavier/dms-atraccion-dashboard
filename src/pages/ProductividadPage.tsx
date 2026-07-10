import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { DateFilter } from '../components/DateFilter'
import { RecruiterPhoto } from '../components/RecruiterPhoto'
import { PageHeader, StatCard } from '../components/ui'
import { useData } from '../context/DataContext'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { formatReclutadorLabel } from '../lib/chartHelpers'
import { resolveTiempoConTactical } from '../lib/tiempoTactical'
import { cn } from '../lib/utils'

export function ProductividadPage() {
  const { data } = useData()
  const [selected, setSelected] = useState('ANDREA')
  const [dateFilter, setDateFilter] = useState(EMPTY_DATE_FILTER)

  const allDates = useMemo(
    () => data?.reclutadores.map((r) => r.fecha) ?? [],
    [data],
  )

  const filtered = useMemo(() => {
    if (!data) return []
    return data.reclutadores.filter((r) => matchesDateFilter(r.fecha, dateFilter))
  }, [data, dateFilter])

  if (!data) return null

  const reclutadores = [...new Set(filtered.map((r) => r.reclutador))]
  const activeName = reclutadores.includes(selected) ? selected : reclutadores[0] ?? selected
  const records = filtered.filter((r) => r.reclutador === activeName)
  const current = records[0]
  const perfil = data.perfiles.find(
    (p) => p.nombre.toUpperCase() === activeName.toUpperCase(),
  )
  const fotoExcel = data.fotos.find((f) => f.nombre.toUpperCase() === activeName.toUpperCase())?.foto
  const tiempoTactical = perfil?.fechaIngreso
    ? resolveTiempoConTactical(perfil.fechaIngreso)
    : (perfil?.tiempoConTactical ?? '—')

  const totals = records.reduce(
    (acc, r) => ({
      ingresos: acc.ingresos + r.ingresos,
      procesos: acc.procesos + r.procesos,
      citados: acc.citados + r.citados,
    }),
    { ingresos: 0, procesos: 0, citados: 0 },
  )

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Productividad por Reclutador"
        subtitle={formatFilterLabel(dateFilter)}
      />

      <DateFilter dates={allDates} value={dateFilter} onChange={setDateFilter} className="mb-3 shrink-0 sm:mb-4" />

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-400 shadow-sm">
          No hay datos para el periodo seleccionado
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          <div className="col-span-12 rounded-2xl bg-white p-3 shadow-sm sm:p-4 lg:col-span-3">
            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Reclutador</p>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {reclutadores.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelected(name)}
                  className={cn(
                    'shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all lg:w-full lg:text-left',
                    activeName === name
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-brand/5 text-brand hover:bg-brand/10',
                  )}
                >
                  {formatReclutadorLabel(name)}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm md:col-span-1">
                <div className="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-brand/20 bg-slate-100">
                  <RecruiterPhoto nombre={activeName} externalUrl={fotoExcel} />
                </div>
                <h3 className="text-center text-xl font-bold text-brand">{formatReclutadorLabel(activeName)}</h3>
              </div>

              <motion.div
                key={activeName}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center rounded-2xl border border-brand/10 bg-white p-6 shadow-sm md:col-span-2"
              >
                <div className="flex items-center gap-2 text-brand">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Tiempo en Tactical Support</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-brand">
                  {tiempoTactical}
                </p>
              </motion.div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Ingresos" value={records.length > 1 ? totals.ingresos : (current?.ingresos ?? 0)} accent="border-brand" />
              <StatCard label="Procesos" value={records.length > 1 ? totals.procesos : (current?.procesos ?? 0)} accent="border-blue-500" />
              <StatCard label="Citados" value={records.length > 1 ? totals.citados : (current?.citados ?? 0)} accent="border-indigo-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
