import * as XLSX from 'xlsx'
import type { DashboardData, Descartado, Foto, Lead, Perfil, Reclutador } from '../types'
import { EXCEL_FILE, assetUrl } from './assets'
import { clearExcelFile, loadExcelFile, saveExcelFile } from './excelStorage'
import { excelDateToJS } from './utils'

function num(v: unknown): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function str(v: unknown): string {
  return String(v ?? '').trim()
}

export function parseWorkbook(buffer: ArrayBuffer): DashboardData {
  const workbook = XLSX.read(buffer, { type: 'array' })

  const sheet = (name: string) => {
    if (!workbook.Sheets[name]) {
      throw new Error(`Falta la hoja "${name}" en el Excel`)
    }
    return workbook.Sheets[name]
  }

  const reclutadores: Reclutador[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet('RECLUTADORES'))
    .map((row) => ({
      reclutador: str(row.RECLUTADOR),
      ingresos: num(row.INGRESOS),
      procesos: num(row.PROCESOS),
      citados: num(row.CITADOS),
      fecha: excelDateToJS(num(row.FECHA)),
    }))

  const leads: Lead[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet('LEADS'))
    .map((row) => ({
      reclutador: str(row.RECLUTADOR),
      asignado: num(row.ASIGNADO),
      revisado: num(row.REVISADO),
      mes: excelDateToJS(num(row.MES)),
    }))

  const descartados: Descartado[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet('DESCARTADOS'))
    .map((row) => ({
      candidatos: num(row.CANDIDATOS),
      tipo: str(row.TIPO),
      fecha: excelDateToJS(num(row.FECHA)),
    }))

  const perfiles: Perfil[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet('PERFIL'))
    .map((row) => ({
      nombre: str(row.NOMBRE),
      tiempoConTactical: str(row['TIEMPO CON TACTICAL']),
    }))

  const fotos: Foto[] = XLSX.utils
    .sheet_to_json<Record<string, unknown>>(sheet('FOTO'))
    .map((row) => ({
      nombre: str(row.NOMBRE),
      foto: row.FOTO ? str(row.FOTO) : undefined,
    }))

  return { reclutadores, leads, descartados, perfiles, fotos }
}

async function loadFromServer(): Promise<{ data: DashboardData; source: string }> {
  const url = `${assetUrl(EXCEL_FILE)}?t=${Date.now()}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`No se pudo cargar el Excel (${response.status})`)
  }
  const buffer = await response.arrayBuffer()
  return { data: parseWorkbook(buffer), source: 'productividad-atraccion.xlsx' }
}

async function loadFromImport(): Promise<{ data: DashboardData; source: string } | null> {
  const stored = await loadExcelFile()
  if (!stored) return null
  const buffer = await stored.blob.arrayBuffer()
  return { data: parseWorkbook(buffer), source: stored.fileName }
}

export async function loadDashboardData(): Promise<{ data: DashboardData; source: string }> {
  const imported = await loadFromImport()
  if (imported) return imported
  return loadFromServer()
}

export async function importDashboardExcel(file: File): Promise<{ data: DashboardData; source: string }> {
  if (!file.name.match(/\.xlsx?$/i)) {
    throw new Error('Selecciona un archivo Excel (.xlsx)')
  }
  const buffer = await file.arrayBuffer()
  const data = parseWorkbook(buffer)
  await saveExcelFile(file, file.name)
  return { data, source: file.name }
}

export async function resetToServerExcel(): Promise<{ data: DashboardData; source: string }> {
  await clearExcelFile()
  return loadFromServer()
}
