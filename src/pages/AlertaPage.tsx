import { motion } from 'framer-motion'
import { AlertTriangle, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { useEditableAlerta } from '../hooks/useEditableAlerta'
import { cn } from '../lib/utils'

export function AlertaPage() {
  const {
    items,
    draft,
    editing,
    startEditing,
    save,
    cancel,
    reset,
    updateDraft,
    addItem,
    removeItem,
  } = useEditableAlerta()

  const displayItems = editing ? draft : items

  return (
    <div>
      <PageHeader
        title="Servicios en Alerta"
        subtitle={editing ? 'Modo edición — los cambios se guardan en el navegador' : 'Top servicios con mayor déficit de personal'}
      >
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 rounded-lg border border-brand/20 px-3 py-2 text-sm font-medium text-brand hover:bg-brand/5"
              >
                <Plus className="h-4 w-4" />
                Agregar
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Restaurar
              </button>
              <button
                type="button"
                onClick={cancel}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
              >
                <Save className="h-4 w-4" />
                Guardar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {displayItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
              No hay servicios. Usa <strong>Agregar</strong> para crear uno.
            </div>
          )}

          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm',
                editing ? 'border-brand/20' : 'border-red-100',
              )}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
                {i + 1}
              </div>

              {editing ? (
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    type="text"
                    value={item.nombre}
                    onChange={(e) => updateDraft(item.id, 'nombre', e.target.value)}
                    placeholder="Nombre del servicio"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-brand focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.detalle}
                    onChange={(e) => updateDraft(item.id, 'detalle', e.target.value)}
                    placeholder="Detalle (ej. 2 JT + 1 Oficial)"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-brand">{item.nombre}</h3>
                  <p className="text-sm text-slate-500">{item.detalle}</p>
                </div>
              )}

              {editing ? (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              ) : (
                <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 p-8">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-20 w-20 text-amber-500" />
            <p className="mt-4 text-2xl font-bold text-brand">Atención Prioritaria</p>
            <p className="mt-2 text-sm text-slate-500">
              {editing
                ? 'Edita los servicios y presiona Guardar para conservar los cambios'
                : 'Estos servicios requieren acción inmediata de reclutamiento'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
