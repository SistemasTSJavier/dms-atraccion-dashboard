interface TooltipEntry {
  name?: string
  value?: number | string
  color?: string
  fill?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

export interface LegendItem {
  label: string
  color: string
}

export function ChartColorLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="mb-3 flex flex-wrap justify-center gap-2 sm:mb-4 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
        >
          <span
            className="h-4 w-4 shrink-0 rounded-md border border-black/10 shadow-inner"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span className="text-xs font-bold text-brand sm:text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
      style={{ minWidth: 140 }}
    >
      {label && (
        <p className="mb-2 border-b border-slate-100 pb-1.5 text-sm font-bold text-brand">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={String(entry.name)} className="flex items-center gap-2 text-sm">
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color ?? entry.fill }}
            />
            <span className="text-slate-600">{entry.name}</span>
            <span className="ml-auto font-bold text-brand">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Leyenda para gráfica vertical con una barra por categoría */
export function CategoryColorLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
      {items.map((item) => (
        <div key={item.label} className="flex max-w-[200px] items-center gap-2">
          <span
            className="h-3.5 w-3.5 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate text-[11px] font-semibold text-slate-600 sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
