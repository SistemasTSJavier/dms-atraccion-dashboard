import * as XLSX from 'xlsx'
import type { DashboardData, Descartado, Foto, Lead, Perfil, Reclutador } from '../types'
import { EXCEL_FILE, assetUrl } from './assets'
import { excelDateToJS } from './utils'

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function str(v: unknown): string {
  return String(v ?? '').trim()
}

export async function loadDashboardData(): Promise<DashboardData> {
  const url = `${assetUrl(EXCEL_FILE)}?t=${Date.now()}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`No se pudo cargar el Excel (${response.status}): ${url}`)
  }
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  const reclutadores: Reclutador[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(workbook.Sheets['RECLUTADORES'])
    .map((row) => ({
      reclutador: str(row.RECLUTADOR),
      ingresos: num(row.INGRESOS),
      procesos: num(row.PROCESOS),
      citados: num(row.CITADOS),
      fecha: excelDateToJS(num(row.FECHA)),
    }))

  const leads: Lead[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(workbook.Sheets['LEADS'])
    .map((row) => ({
      reclutador: str(row.RECLUTADOR),
      asignado: num(row.ASIGNADO),
      revisado: num(row.REVISADO),
      mes: excelDateToJS(num(row.MES)),
    }))

  const descartados: Descartado[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(workbook.Sheets['DESCARTADOS'])
    .map((row) => ({
      candidatos: num(row.CANDIDATOS),
      tipo: str(row.TIPO),
      fecha: excelDateToJS(num(row.FECHA)),
    }))

  const perfiles: Perfil[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(workbook.Sheets['PERFIL'])
    .map((row) => ({
      nombre: str(row.NOMBRE),
      tiempoConTactical: str(row['TIEMPO CON TACTICAL']),
    }))

  const fotos: Foto[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(workbook.Sheets['FOTO'])
    .map((row) => ({
      nombre: str(row.NOMBRE),
      foto: row.FOTO ? str(row.FOTO) : undefined,
    }))

  return { reclutadores, leads, descartados, perfiles, fotos }
}
