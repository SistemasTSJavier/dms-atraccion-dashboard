import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { importDashboardExcel, loadDashboardData, resetToServerExcel } from '../lib/excel'
import type { DashboardData } from '../types'

interface DataContextValue {
  data: DashboardData | null
  loading: boolean
  error: string | null
  sourceFile: string
  isImported: boolean
  /** Cambia al refrescar/importar para forzar recarga de fotos e imágenes */
  assetVersion: number
  refresh: () => Promise<void>
  importExcel: (file: File) => Promise<void>
  useServerFile: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sourceFile, setSourceFile] = useState('productividad-atraccion.xlsx')
  const [isImported, setIsImported] = useState(false)
  const [assetVersion, setAssetVersion] = useState(() => Date.now())

  const applyResult = (result: { data: DashboardData; source: string }, imported: boolean) => {
    setData(result.data)
    setSourceFile(result.source)
    setIsImported(imported)
    setError(null)
    setAssetVersion(Date.now())
  }

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loadDashboardData()
      applyResult(result, result.source !== 'productividad-atraccion.xlsx')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [])

  const importExcel = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const result = await importDashboardExcel(file)
      applyResult(result, true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al importar Excel')
    } finally {
      setLoading(false)
    }
  }, [])

  const useServerFile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await resetToServerExcel()
      applyResult(result, false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar archivo del servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <DataContext.Provider value={{ data, loading, error, sourceFile, isImported, assetVersion, refresh, importExcel, useServerFile }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
