import { useCallback, useEffect, useState } from 'react'
import { serviciosAlerta as DEFAULT_SERVICIOS } from '../data/constants'

export interface ServicioAlerta {
  id: string
  rank: number
  nombre: string
  detalle: string
}

const STORAGE_KEY = 'dms-servicios-alerta'

function withIds(items: Omit<ServicioAlerta, 'id'>[]): ServicioAlerta[] {
  return items.map((item, i) => ({
    ...item,
    id: `default-${i}`,
    rank: i + 1,
  }))
}

const DEFAULTS: ServicioAlerta[] = withIds(
  DEFAULT_SERVICIOS.map(({ nombre, detalle }) => ({ rank: 0, nombre, detalle })),
)

function loadFromStorage(): ServicioAlerta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as ServicioAlerta[]
    return parsed.length > 0 ? parsed.map((s, i) => ({ ...s, rank: i + 1 })) : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export function useEditableAlerta() {
  const [items, setItems] = useState<ServicioAlerta[]>(loadFromStorage)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ServicioAlerta[]>(items)

  useEffect(() => {
    if (!editing) setDraft(items)
  }, [items, editing])

  const save = useCallback(() => {
    const normalized = draft
      .filter((s) => s.nombre.trim())
      .map((s, i) => ({ ...s, rank: i + 1, nombre: s.nombre.trim(), detalle: s.detalle.trim() }))
    setItems(normalized)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    setEditing(false)
  }, [draft])

  const cancel = useCallback(() => {
    setDraft(items)
    setEditing(false)
  }, [items])

  const reset = useCallback(() => {
    setItems(DEFAULTS)
    setDraft(DEFAULTS)
    localStorage.removeItem(STORAGE_KEY)
    setEditing(false)
  }, [])

  const updateDraft = useCallback((id: string, field: 'nombre' | 'detalle', value: string) => {
    setDraft((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }, [])

  const addItem = useCallback(() => {
    setDraft((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, rank: prev.length + 1, nombre: '', detalle: '' },
    ])
  }, [])

  const removeItem = useCallback((id: string) => {
    setDraft((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const startEditing = useCallback(() => {
    setDraft(items)
    setEditing(true)
  }, [items])

  return {
    items,
    draft,
    editing,
    startEditing,
    save,
    cancel,
    reset,
    updateDraft,
    addItem,
    removeItem,
  }
}
