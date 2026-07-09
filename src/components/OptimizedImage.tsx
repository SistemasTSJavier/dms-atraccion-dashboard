import { useEffect, useState } from 'react'
import { blobToObjectUrl, loadImage } from '../lib/imageStorage'
import { cn } from '../lib/utils'

type OptimizedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  variant?: 'photo' | 'screenshot' | 'logo'
}

export function OptimizedImage({
  variant = 'photo',
  className,
  alt = '',
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      alt={alt}
      decoding="async"
      loading="eager"
      onLoad={() => setLoaded(true)}
      className={cn(
        'transition-opacity duration-200',
        loaded ? 'opacity-100' : 'opacity-0',
        variant === 'screenshot' && 'image-screenshot',
        variant === 'photo' && 'image-photo',
        variant === 'logo' && 'image-logo',
        className,
      )}
      {...props}
    />
  )
}

/** Hook para cargar imagen desde IndexedDB o URL por defecto */
export function useStoredImage(storageKey: string, defaultSrc: string) {
  const [src, setSrc] = useState(defaultSrc)
  const [isCustom, setIsCustom] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const blob = await loadImage(storageKey)
        if (blob && !cancelled) {
          objectUrl = await blobToObjectUrl(blob)
          setSrc(objectUrl)
          setIsCustom(true)
        } else if (!cancelled) {
          setSrc(defaultSrc)
          setIsCustom(false)
        }
      } catch {
        if (!cancelled) {
          setSrc(defaultSrc)
          setIsCustom(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [storageKey, defaultSrc])

  return { src, isCustom, loading, setSrc, setIsCustom }
}
