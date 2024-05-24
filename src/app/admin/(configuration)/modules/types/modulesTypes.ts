export interface ModuleCRUDType {
  id: string;
  title: string;
  description?: string;
  icon: string | null;
  order: number;
  url?: string;
  module: Module | null;
  status: string;
}
export interface Module {
  id: string;
  title: string;
  order: number;
}
