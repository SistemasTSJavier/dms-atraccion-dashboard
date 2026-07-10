export interface Reclutador {
  reclutador: string
  ingresos: number
  procesos: number
  citados: number
  fecha: Date
}

export interface Lead {
  reclutador: string
  asignado: number
  revisado: number
  mes: Date
}

export interface Descartado {
  candidatos: number
  tipo: string
  fecha: Date
}

export interface Perfil {
  nombre: string
  /** Texto listo para mostrar (calculado desde fecha de ingreso o legacy) */
  tiempoConTactical: string
  /** Fecha de ingreso si el Excel trae fecha en lugar de texto */
  fechaIngreso?: Date
}

export interface Foto {
  nombre: string
  foto?: string
}

export interface DashboardData {
  reclutadores: Reclutador[]
  leads: Lead[]
  descartados: Descartado[]
  perfiles: Perfil[]
  fotos: Foto[]
}

export type PageId =
  | 'inicio'
  | 'pvsi'
  | 'descartados'
  | 'productividad'
  | 'mensual'
  | 'leads'
  | 'semaforo'
  | 'alerta'
  | 'kaizen'
  | 'final'
