import { useEffect, useState } from 'react'

/** Altura según cantidad de filas (reclutadores) para gráficas horizontales */
export function useRowChartHeight(rowCount: number, rowHeight = 52, offset = 300, min = 240) {
  const calc = (count: number) => {
    const content = Math.max(count, 1) * rowHeight + 48
    const available = typeof window !== 'undefined' ? window.innerHeight - offset : 500
    return Math.max(min, Math.min(content, available))
  }

  const [height, setHeight] = useState(() => calc(rowCount))

  useEffect(() => {
    const update = () => setHeight(calc(rowCount))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [rowCount, rowHeight, offset, min])

  return height
}

export function formatReclutadorLabel(name: string): string {
  if (!name) return name
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export const TICK_RECLUTADOR = {
  fill: '#09124f',
  fontSize: 12,
  fontWeight: 700,
} as const

export const MARGIN_H_RECRUITER = { top: 8, right: 52, left: 4, bottom: 8 }

export const MARGIN_H_PVSI = { top: 12, right: 56, left: 12, bottom: 12 }

export const MARGIN_V_RECRUITER = { top: 28, right: 16, left: 4, bottom: 4 }

export const MARGIN_V_LEADS = { top: 32, right: 12, left: 0, bottom: 0 }

export const XAXIS_RECLUTADOR = {
  tick: TICK_RECLUTADOR,
  angle: -35,
  textAnchor: 'end' as const,
  height: 72,
  interval: 0,
}

export function columnChartMinWidth(count: number, containerWidth = 0, perColumn = 68): number {
  const byCount = Math.max(count, 1) * perColumn
  return containerWidth > 0 ? Math.max(containerWidth, byCount) : byCount
}
