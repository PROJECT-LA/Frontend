/// CRUD de parametros

export interface ParametroCRUDType {
  id: string;
  code: string;
  name: string;
  group: string;
  description: string;
  status: string;
}

export interface CrearEditarParametroCRUDType {
  id?: string;
  code: string;
  name: string;
  group: string;
  description: string;
}
