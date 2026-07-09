import { useCallback, useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload, ZoomIn, ZoomOut } from 'lucide-react'
import { OptimizedImage, useStoredImage } from '../components/OptimizedImage'
import { PageHeader } from '../components/ui'
import { assetUrl } from '../lib/assets'
import { processImageForStorage } from '../lib/imageOptimize'
import { deleteImage, saveImage } from '../lib/imageStorage'
import { cn } from '../lib/utils'

const STORAGE_KEY = 'semaforo-capture'
const DEFAULT_IMAGE = assetUrl('semaforo-default.png')

export function SemaforoPage() {
  const { src, isCustom, loading, setSrc, setIsCustom } = useStoredImage(STORAGE_KEY, DEFAULT_IMAGE)
  const [zoom, setZoom] = useState(100)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const blob = await processImageForStorage(file)
      await saveImage(STORAGE_KEY, blob)

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setSrc(url)
      setIsCustom(true)
      setZoom(100)
    } finally {
      setUploading(false)
    }
  }, [setSrc, setIsCustom])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const resetImage = async () => {
    await deleteImage(STORAGE_KEY)
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setSrc(DEFAULT_IMAGE)
    setIsCustom(false)
    setZoom(100)
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Semáforo de Posiciones" subtitle="Captura en alta calidad — actualizable">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="rounded-lg bg-brand/5 p-2 text-brand hover:bg-brand/10"
            title="Alejar"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="min-w-[3rem] text-center text-xs font-medium text-slate-500">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(200, z + 15))}
            className="rounded-lg bg-brand/5 p-2 text-brand hover:bg-brand/10"
            title="Acercar"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Procesando...' : 'Importar captura'}
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={resetImage}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Restaurar
            </button>
          )}
        </div>
      </PageHeader>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex-1 overflow-auto rounded-2xl border-2 bg-slate-50 shadow-sm transition-colors',
          dragOver ? 'border-brand bg-brand/5' : 'border-slate-200',
        )}
      >
        {dragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-brand/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-brand">
              <ImagePlus className="h-12 w-12" />
              <p className="font-semibold">Suelta la captura aquí</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            Cargando captura...
          </div>
        ) : (
          <div className="flex min-h-full items-start justify-center p-4">
            <OptimizedImage
              src={src}
              alt="Reporte semáforo de posiciones"
              variant="screenshot"
              style={{ width: `${zoom}%`, height: 'auto' }}
              className="rounded-lg shadow-md"
              onError={() => setSrc(DEFAULT_IMAGE)}
            />
          </div>
        )}

        {!isCustom && !dragOver && !loading && (
          <div className="absolute right-4 bottom-4 rounded-xl bg-brand/90 px-4 py-2 text-xs text-white shadow-lg">
            Arrastra una captura o usa <strong>Importar captura</strong>
          </div>
        )}
      </div>
    </div>
  )
}
