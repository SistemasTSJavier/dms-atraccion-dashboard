/** Ruta base para assets (funciona en local y en GitHub Pages) */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${clean}`
}

export const EXCEL_FILE = 'data/PRODUCTIVIDAD ATRACCION TALENTO.xlsx'
