import { useCallback, useEffect, useRef, useState } from 'react'
import { Expand, ImagePlus, Shrink, Trash2, Upload } from 'lucide-react'
import { useStoredImage } from '../components/OptimizedImage'
import { PageHeader } from '../components/ui'
import { assetUrl } from '../lib/assets'
import { processScreenshotForStorage } from '../lib/imageOptimize'
import { deleteImage, saveImage } from '../lib/imageStorage'
import { cn } from '../lib/utils'

const STORAGE_KEY = 'semaforo-capture'
const DEFAULT_IMAGE = assetUrl('semaforo-default.png')

type FitMode = 'width' | 'actual'

export function SemaforoPage() {
  const { src, isCustom, loading, setSrc, setIsCustom } = useStoredImage(STORAGE_KEY, DEFAULT_IMAGE)
  const [fitMode, setFitMode] = useState<FitMode>('width')
  const [zoom, setZoom] = useState(100)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const blob = await processScreenshotForStorage(file)
      await saveImage(STORAGE_KEY, blob)

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setSrc(url)
      setIsCustom(true)
      setFitMode('width')
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
    setFitMode('width')
    setZoom(100)
    setNaturalSize({ w: 0, h: 0 })
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
  }

  const displayWidth = fitMode === 'actual' && naturalSize.w > 0
    ? Math.round(naturalSize.w * (zoom / 100))
    : undefined

  useEffect(() => {
    if (fitMode === 'actual') setZoom(100)
  }, [fitMode])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader title="Semáforo de Posiciones" subtitle="Captura en resolución original">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setFitMode('width')}
            className={cn(
              'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium sm:text-sm',
              fitMode === 'width' ? 'bg-brand text-white' : 'bg-brand/5 text-brand hover:bg-brand/10',
            )}
            title="Ajustar al ancho"
          >
            <Shrink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ajustar</span>
          </button>
          <button
            type="button"
            onClick={() => setFitMode('actual')}
            className={cn(
              'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium sm:text-sm',
              fitMode === 'actual' ? 'bg-brand text-white' : 'bg-brand/5 text-brand hover:bg-brand/10',
            )}
            title="Tamaño real (máxima resolución)"
          >
            <Expand className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tamaño real</span>
          </button>
          {fitMode === 'actual' && (
            <>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 25))}
                className="rounded-lg bg-brand/5 px-2 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
              >
                −
              </button>
              <span className="min-w-[2.5rem] text-center text-xs font-medium text-slate-500">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(300, z + 25))}
                className="rounded-lg bg-brand/5 px-2 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
              >
                +
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light disabled:opacity-50 sm:text-sm"
          >
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {uploading ? 'Guardando...' : 'Importar'}
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={resetImage}
              className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 sm:text-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
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
          'relative min-h-0 flex-1 overflow-auto rounded-2xl border-2 bg-slate-100 shadow-sm transition-colors',
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
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-slate-400">
            Cargando captura...
          </div>
        ) : (
          <div className={cn(
            'p-2 sm:p-4',
            fitMode === 'actual' ? 'inline-block min-w-full' : 'flex justify-center',
          )}>
            <img
              src={src}
              alt="Reporte semáforo de posiciones"
              onLoad={onImageLoad}
              onError={() => setSrc(DEFAULT_IMAGE)}
              className={cn(
                'rounded-lg shadow-md',
                fitMode === 'width' ? 'h-auto w-full max-w-full' : 'h-auto max-w-none',
              )}
              style={displayWidth ? { width: displayWidth } : undefined}
              decoding="sync"
              loading="eager"
            />
          </div>
        )}

        {naturalSize.w > 0 && isCustom && (
          <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white sm:text-xs">
            {naturalSize.w} × {naturalSize.h} px
            {fitMode === 'actual' && ` · ${zoom}%`}
          </div>
        )}

        {!isCustom && !dragOver && !loading && (
          <div className="absolute right-2 bottom-2 rounded-xl bg-brand/90 px-3 py-1.5 text-[10px] text-white shadow-lg sm:text-xs">
            Usa <strong>Importar</strong> para subir captura en alta resolución
          </div>
        )}
      </div>
    </div>
  )
}
