import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, UserCircle } from 'lucide-react'
import { DateFilter } from '../components/DateFilter'
import { OptimizedImage } from '../components/OptimizedImage'
import { PageHeader, StatCard } from '../components/ui'
import { useData } from '../context/DataContext'
import { EMPTY_DATE_FILTER, formatFilterLabel, matchesDateFilter } from '../lib/dateFilters'
import { cn, getPhotoUrl } from '../lib/utils'

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
  const perfil = data.perfiles.find((p) => p.nombre === activeName)
  const photoUrl = getPhotoUrl(activeName)

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
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-2xl bg-white p-4 shadow-sm lg:col-span-3">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">Reclutador</p>
            <div className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-1 lg:grid-cols-1 lg:space-y-1">
              {reclutadores.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelected(name)}
                  className={cn(
                    'w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all',
                    activeName === name
                      ? 'bg-brand text-white shadow-md'
                      : 'text-brand hover:bg-brand/5',
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm md:col-span-1">
                <div className="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-brand/20 bg-slate-100">
                  {photoUrl ? (
                    <OptimizedImage
                      src={photoUrl}
                      alt={activeName}
                      variant="photo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-24 w-24 text-brand/30" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-brand">{activeName}</h3>
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
                  {perfil?.tiempoConTactical ?? '—'}
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
