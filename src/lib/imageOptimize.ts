const MAX_DIMENSION = 4096
const JPEG_QUALITY = 0.95

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo cargar la imagen'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Error al procesar imagen'))),
      type,
      quality,
    )
  })
}

/** Procesa imagen conservando calidad: solo reduce si supera maxDimension. PNG se mantiene sin pérdida. */
export async function processImageForStorage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen')
  }

  const img = await loadImageFromFile(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight))

  if (scale === 1) {
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas no disponible')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const isPng = file.type === 'image/png' || file.type === 'image/webp'
  const mime = isPng ? 'image/png' : 'image/jpeg'
  return canvasToBlob(canvas, mime, isPng ? undefined : JPEG_QUALITY)
}
