import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  BarChart3,
  CalendarDays,
  Home,
  Lightbulb,
  Target,
  TrafficCone,
  UserX,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NAV_ITEMS } from '../data/constants'
import type { PageId } from '../types'
import { useData } from '../context/DataContext'
import { assetUrl } from '../lib/assets'
import { cn } from '../lib/utils'
import { OptimizedImage } from './OptimizedImage'

const iconMap: Record<string, LucideIcon> = {
  Home,
  BarChart3,
  UserX,
  Users,
  CalendarDays,
  Target,
  TrafficCone,
  AlertTriangle,
  Lightbulb,
  Award,
}

interface SidebarProps {
  active: PageId
  onNavigate: (page: PageId) => void
  onClose?: () => void
}

export function Sidebar({ active, onNavigate, onClose }: SidebarProps) {
  const { assetVersion } = useData()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-brand text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex-1">
          <OptimizedImage
            key={assetVersion}
            src={assetUrl('logo.png', assetVersion)}
            alt="Logo"
            variant="logo"
            className="mx-auto h-12 object-contain sm:h-14"
          />
          <p className="mt-2 text-center text-[10px] font-semibold tracking-widest text-white/70 uppercase sm:text-xs">
            DMS Atracción
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="ml-2 rounded-lg p-1 hover:bg-white/10 lg:hidden" aria-label="Cerrar menú">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-amber-300')} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-center text-[10px] text-white/40">
        Productividad Atracción
      </div>
    </aside>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-3 flex shrink-0 flex-wrap items-end justify-between gap-3 sm:mb-4 md:mb-6">
      <div className="min-w-0">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-brand sm:text-xl md:text-2xl"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  icon?: LucideIcon
  accent?: string
}

export function StatCard({ label, value, icon: Icon, accent = 'border-brand' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('rounded-2xl border-l-4 bg-white p-5 shadow-sm', accent)}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-brand/40" />}
      </div>
      <p className="mt-1 text-2xl font-bold text-brand sm:mt-2 sm:text-3xl">{value}</p>
    </motion.div>
  )
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col rounded-2xl bg-white p-3 shadow-sm sm:p-4 md:p-6', className)}>
      <h3 className="mb-2 shrink-0 text-center text-sm font-bold text-brand sm:mb-3 sm:text-base md:text-lg">{title}</h3>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Cargando datos...' }: LoadingStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <p className="mt-4 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  )
}
