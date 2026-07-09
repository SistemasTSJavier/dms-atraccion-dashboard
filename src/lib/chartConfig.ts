export const BAR_LABEL_TOP = {
  position: 'top' as const,
  fill: '#000000',
  fontSize: 12,
  fontWeight: 700,
}

export const BAR_LABEL_RIGHT = {
  position: 'right' as const,
  fill: '#000000',
  fontSize: 12,
  fontWeight: 700,
}

export const CHART_MARGIN = { top: 12, right: 16, left: 4, bottom: 4 }

export const CHART_MARGIN_VERTICAL = { top: 8, right: 48, left: 4, bottom: 8 }

/** Colores distintivos por métrica */
export const SERIES_COLORS = {
  ingresos: '#09124f',
  procesos: '#2563eb',
  citados: '#f59e0b',
  asignado: '#09124f',
  revisado: '#10b981',
} as const

/** Paleta para categorías (descartados) */
export const CATEGORY_COLORS = [
  '#09124f',
  '#dc2626',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#0891b2',
  '#ea580c',
]

export const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  padding: '10px 14px',
}
