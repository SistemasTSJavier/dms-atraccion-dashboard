import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function excelDateToJS(serial: number): Date {
  const utcDays = Math.floor(serial - 25569)
  return new Date(utcDays * 86400 * 1000)
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
}

import { assetUrl } from './assets'

export function getPhotoUrl(nombre: string): string | null {
  const key = nombre.toLowerCase()
  if (key === 'karina') return assetUrl('photos/karina.jpeg')
  if (key === 'eliud') return assetUrl('photos/eliud.jpeg')
  return null
}
