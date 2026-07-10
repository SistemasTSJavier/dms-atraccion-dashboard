import { assetUrl } from './assets'

const EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp'] as const

/** Alias de archivo cuando el nombre en Excel no coincide 1:1 con el archivo */
const PHOTO_ALIASES: Record<string, string[]> = {
  beatriz: ['beatriz'],
  'beatriz majata': ['beatriz', 'beatriz-majata', 'beatriz_majata'],
}

function nombreToSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function photoSlugs(nombre: string): string[] {
  const full = nombreToSlug(nombre)
  const first = full.split(/\s+/)[0] ?? full
  const aliases = PHOTO_ALIASES[full] ?? []
  return [...new Set([full, first, ...aliases].filter(Boolean))]
}

/** Rutas locales a probar: photos/andrea.jpeg, photos/beatriz.jpeg, etc. */
export function getPhotoCandidates(
  nombre: string,
  externalUrl?: string,
  cacheBust?: string | number,
): string[] {
  const local = photoSlugs(nombre).flatMap((slug) =>
    EXTENSIONS.map((ext) => assetUrl(`photos/${slug}.${ext}`, cacheBust)),
  )

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
