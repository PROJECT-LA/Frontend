// Form Login

export interface LoginType {
  usuario: string
  contrasena: string
}

export interface idRolType {
  idRol: string
}

/// Usuario que iniciar sesión

export interface PersonaType {
  names: string
  lastNames: string
  nroDocumento: string
  fechaNacimiento: string
}

export interface UsuarioType {
  id: string
  usuario: string // ADMIN | TÉCNICO ...
  idRole: string // Id del rol
  persona: PersonaType
  roles: RoleType[]
}

export interface RoleType {
  id: string
  rol: string
  name: string
  modulos: ModuloType[]
}

export interface PropiedadesType {
  icono?: string
  descripcion?: string
  orden: number
}

export type ModuloType = {
  id: string
  label: string
  url: string
  nombre: string
  propiedades: PropiedadesType
  estado: string
  subModulo: SubModuloType[]
}

export type SubModuloType = {
  id: string
  label: string
  url: string
  nombre: string
  propiedades: PropiedadesType
  estado: string
}

/*  *********************************************************** */
export interface PoliticaType {
  sujeto: string
  objeto: string
  accion: string
}
