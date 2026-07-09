import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileSpreadsheet, Menu, RefreshCw, RotateCcw } from 'lucide-react'
import { Sidebar, LoadingState } from './components/ui'
import { DataProvider, useData } from './context/DataContext'
import { AlertaPage } from './pages/AlertaPage'
import { DescartadosPage } from './pages/DescartadosPage'
import { FinalPage } from './pages/FinalPage'
import { InicioPage } from './pages/InicioPage'
import { KaizenPage } from './pages/KaizenPage'
import { LeadsPage } from './pages/LeadsPage'
import { MensualPage } from './pages/MensualPage'
import { ProductividadPage } from './pages/ProductividadPage'
import { PVSIPage } from './pages/PVSIPage'
import { SemaforoPage } from './pages/SemaforoPage'
import type { PageId } from './types'

function Dashboard() {
  const { data, loading, error, sourceFile, isImported, refresh, importExcel, useServerFile } = useData()
  const [page, setPage] = useState<PageId>('inicio')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const navigate = (id: PageId) => {
    setPage(id)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    switch (page) {
      case 'inicio': return <InicioPage />
      case 'pvsi': return <PVSIPage />
      case 'descartados': return <DescartadosPage />
      case 'productividad': return <ProductividadPage />
      case 'mensual': return <MensualPage />
      case 'leads': return <LeadsPage />
      case 'semaforo': return <SemaforoPage />
      case 'alerta': return <AlertaPage />
      case 'kaizen': return <KaizenPage />
      case 'final': return <FinalPage />
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar active={page} onNavigate={navigate} onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-4 md:px-6 md:py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-brand hover:bg-brand/5 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-xs text-slate-500">
                {isImported ? 'Importado' : 'Servidor'}: <span className="font-medium text-brand">{sourceFile}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) importExcel(file)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-medium text-white hover:bg-brand-light disabled:opacity-50 sm:px-3 sm:text-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Importar Excel</span>
              <span className="sm:hidden">Importar</span>
            </button>
            {isImported && (
              <button
                type="button"
                onClick={useServerFile}
                disabled={loading}
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:flex sm:text-sm"
                title="Volver al Excel del servidor"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Servidor
              </button>
            )}
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-brand/5 px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 disabled:opacity-50 sm:px-3 sm:text-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 sm:p-4 md:p-6">
          {loading && !data ? (
            <LoadingState />
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
              <p className="font-semibold">Error al cargar datos</p>
              <p className="mt-1 text-sm">{error}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={refresh} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">
                  Reintentar
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600"
                >
                  Importar Excel
                </button>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="flex min-h-0 flex-1 flex-col"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  )
}
