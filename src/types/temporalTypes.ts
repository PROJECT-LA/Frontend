import { CasbinTypes } from './utils/casbin'

export interface RutasType {
  ruta: string
  permisos: string
}

export interface SolicitarPermisos {
  ruta: string
  rol: string
}

export const RUTAS: RutasType[] = [
  {
    ruta: '/admin/roles',
    permisos: 'read|update|create|delete',
  },
]

// Tipos de datos
// read|update|create|delete
export const obtenerPermisos = (permisos: string): CasbinTypes => {
  const temporal: CasbinTypes = {
    create: permisos.includes('create'),
    delete: permisos.includes('delete'),
    read: permisos.includes('read'),
    update: permisos.includes('update'),
  }

  return temporal
}
