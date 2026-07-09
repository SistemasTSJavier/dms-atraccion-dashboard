import { useEffect, useState } from 'react'

/** Altura dinámica para gráficas según viewport */
export function useChartHeight(offset = 200): number {
  const [height, setHeight] = useState(() =>
    typeof window !== 'undefined' ? Math.max(260, window.innerHeight - offset) : 400,
  )

  useEffect(() => {
    const update = () => setHeight(Math.max(260, window.innerHeight - offset))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [offset])

  return height
}
