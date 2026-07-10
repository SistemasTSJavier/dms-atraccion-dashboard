/** Ruta base para assets (funciona en local y en GitHub Pages) */
export function assetUrl(path: string, cacheBust?: string | number): string {
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\//, '')
  const encoded = clean
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  const url = `${base}${encoded}`
  if (cacheBust === undefined || cacheBust === '') return url
  return `${url}?v=${encodeURIComponent(String(cacheBust))}`
}

export const EXCEL_FILE = 'data/productividad-atraccion.xlsx'
