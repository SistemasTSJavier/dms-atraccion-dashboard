import { assetUrl } from './assets'

const EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp'] as const

function nombreToSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Rutas locales a probar: photos/andrea.jpeg, photos/andrea.jpg, etc. */
export function getPhotoCandidates(
  nombre: string,
  externalUrl?: string,
  cacheBust?: string | number,
): string[] {
  const slug = nombreToSlug(nombre)
  const local = EXTENSIONS.map((ext) => assetUrl(`photos/${slug}.${ext}`, cacheBust))

  if (externalUrl?.startsWith('http') && !externalUrl.includes('drive.google.com')) {
    const busted =
      cacheBust !== undefined
        ? `${externalUrl}${externalUrl.includes('?') ? '&' : '?'}v=${encodeURIComponent(String(cacheBust))}`
        : externalUrl
    return [busted, ...local]
  }

  return local
}

/** @deprecated Usar getPhotoCandidates */
export function getPhotoUrl(nombre: string): string | null {
  const candidates = getPhotoCandidates(nombre)
  return candidates[0] ?? null
}
