export interface CasbinTypes {
  read: boolean
  create: boolean
  update: boolean
  delete: boolean
}


export interface PermisosCasbin {
  ruta: string,
  permisos: CasbinTypes
}