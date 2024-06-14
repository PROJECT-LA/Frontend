export interface RolCRUDType {
  id: string;
  name: string;
}

export interface UserRolCRUDType {
  id: string;
  names: string;
  lastNames: string;
  username: string;
  email: string;
  status: string;
  phone: string;
  roles: RolCRUDType[];
  ci: string;
  address: string;
}

export interface CRUserType {
  id?: string;
  names?: string;
  lastNames: string;
  roles: string[];
  status: string;
  email: string;
  phone: string;
  username: string;
  ci: string;
  address: string;
}

/// Tipo rol transversal

export interface RolType {
  id: string;
  name: string;
  description: string;
}
