/** Calcula años, meses y (si aplica) semanas desde una fecha de ingreso hasta hoy. */
export function formatTiempoDesdeIngreso(ingreso: Date, hoy = new Date()): string {
  if (Number.isNaN(ingreso.getTime()) || ingreso > hoy) return '—'

  let years = hoy.getFullYear() - ingreso.getFullYear()
  let months = hoy.getMonth() - ingreso.getMonth()
  let days = hoy.getDate() - ingreso.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(hoy.getFullYear(), hoy.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  const parts: string[] = []

  if (years > 0) {
    parts.push(years === 1 ? '1 AÑO' : `${years} AÑOS`)
  }
  if (months > 0) {
    parts.push(months === 1 ? '1 MES' : `${months} MESES`)
  }

  // Semanas solo cuando aún no completa un mes
  if (years === 0 && months === 0) {
    const ms = hoy.getTime() - ingreso.getTime()
    const weeks = Math.floor(ms / (7 * 86400000))
    if (weeks > 0) {
      parts.push(weeks === 1 ? '1 SEMANA' : `${weeks} SEMANAS`)
    } else {
      parts.push(days <= 1 ? '1 DÍA' : `${Math.max(days, 0)} DÍAS`)
    }
  }

  return parts.length > 0 ? parts.join(' ') : '—'
}

/** Detecta si el valor del Excel es una fecha (serial, Date o texto fecha). */
export function parseFechaIngreso(value: unknown): Date | null {
  if (value == null || value === '') return null

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value) && value > 20000) {
    // Serial de Excel (días desde 1899-12-30)
    const utcDays = Math.floor(value - 25569)
    const d = new Date(utcDays * 86400 * 1000)
    return Number.isNaN(d.getTime()) ? null : d
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    // Texto legacy tipo "7 MESES" / "1 AÑO 10 MESES" → no es fecha
    if (/mes|año|semana|dia|día/i.test(trimmed)) return null

    // dd/mm/yyyy o dd-mm-yyyy
    const m = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/)
    if (m) {
      const day = Number(m[1])
      const month = Number(m[2])
      let year = Number(m[3])
      if (year < 100) year += 2000
      const d = new Date(year, month - 1, day)
      return Number.isNaN(d.getTime()) ? null : d
    }

    // yyyy-mm-dd
    const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (iso) {
      const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      return Number.isNaN(d.getTime()) ? null : d
    }

    const parsed = Date.parse(trimmed)
    if (!Number.isNaN(parsed)) return new Date(parsed)
  }

  return null
}

/** Resuelve el texto a mostrar: calcula desde fecha o usa texto legacy. */
export function resolveTiempoConTactical(value: unknown, hoy = new Date()): string {
  const fecha = parseFechaIngreso(value)
  if (fecha) return formatTiempoDesdeIngreso(fecha, hoy)

  const text = String(value ?? '').trim()
  return text || '—'
}
