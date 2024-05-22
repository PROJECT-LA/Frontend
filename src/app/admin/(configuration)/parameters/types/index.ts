export interface ParameterCRUDType {
  id: string;
  code: string;
  name: string;
  group: string;
  description: string;
  status: string;
}

export interface CUParameterCRUDType {
  id?: string;
  code: string;
  name: string;
  group: string;
  description: string;
}
