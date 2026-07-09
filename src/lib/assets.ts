/** Ruta base para assets (funciona en local y en GitHub Pages) */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\//, '')
  const encoded = clean
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `${base}${encoded}`
}

export const EXCEL_FILE = 'data/productividad-atraccion.xlsx'
