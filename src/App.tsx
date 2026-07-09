import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
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
  const { data, loading, error, refresh } = useData()
  const [page, setPage] = useState<PageId>('inicio')

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={page} onNavigate={setPage} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-400">
            Datos: PRODUCTIVIDAD ATRACCION TALENTO.xlsx
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand transition hover:bg-brand/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && !data ? (
            <LoadingState />
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
              <p className="font-semibold">Error al cargar datos</p>
              <p className="mt-1 text-sm">{error}</p>
              <button type="button" onClick={refresh} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white">
                Reintentar
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
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
