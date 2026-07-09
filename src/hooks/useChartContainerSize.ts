import { useEffect, useState, type RefObject } from 'react'

export function useChartContainerSize(ref: RefObject<HTMLElement | null>, minHeight = 180) {
  const [size, setSize] = useState({ width: 0, height: minHeight })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      setSize({
        width: el.clientWidth,
        height: Math.max(minHeight, el.clientHeight),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [minHeight])

  return size
}
