export interface RolCRUDType {
  id: string
  name: string
}

export interface UsuarioRolCRUDType {
  id: string
  names: string
  lastNames: string
  username: string
  email: string
  status: string
  phone: string
  password: string
  roles: RolCRUDType[]
}

export interface CrearEditarUsuarioType {
  id?: string
  names?: string
  lastNames: string
  roles: string[]
  status: string
  email: string
  phone: string
  username: string
  password: string
}

/// Tipo rol transversal

export interface RolType {
  id: string
  name: string
  description: string
}
