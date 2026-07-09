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
  type LucideIcon,
} from 'lucide-react'
import { NAV_ITEMS } from '../data/constants'
import type { PageId } from '../types'
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
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-brand text-white shadow-2xl">
      <div className="border-b border-white/10 px-5 py-6">
        <OptimizedImage src={assetUrl('logo.png')} alt="Logo" variant="logo" className="mx-auto h-14 object-contain" />
        <p className="mt-3 text-center text-xs font-semibold tracking-widest text-white/70 uppercase">
          DMS Atracción
        </p>
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-brand"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
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
      <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
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
    <div className={cn('rounded-2xl bg-white p-6 shadow-sm', className)}>
      <h3 className="mb-4 text-center text-lg font-bold text-brand">{title}</h3>
      {children}
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
