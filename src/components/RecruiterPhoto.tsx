import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import { OptimizedImage } from './OptimizedImage'
import { getPhotoCandidates } from '../lib/photos'

interface RecruiterPhotoProps {
  nombre: string
  externalUrl?: string
  className?: string
}

export function RecruiterPhoto({ nombre, externalUrl, className }: RecruiterPhotoProps) {
  const candidates = getPhotoCandidates(nombre, externalUrl)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [nombre, externalUrl])

  const src = candidates[index]

  if (!src || index >= candidates.length) {
    return <UserCircle className="h-24 w-24 text-brand/30" />
  }

  return (
    <OptimizedImage
      src={src}
      alt={nombre}
      variant="photo"
      className={className ?? 'h-full w-full object-cover'}
      onError={() => setIndex((i) => i + 1)}
    />
  )
}
