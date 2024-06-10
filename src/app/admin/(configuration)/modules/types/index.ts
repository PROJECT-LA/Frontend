import { Item } from "@/types";

export interface ModuleCRUDType {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  url?: string;
  // module: Module | null;
  idSection?: string;
  nameSection?: string;
  status: string;
}
export interface Module {
  id: string;
  title: string;
  order: number;
}

export interface CUModuleType {
  title: string;
  url?: string;
  icon?: string;
  idRole: string;
  idModule?: string;
  status?: string;
  description?: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface RolModules {
  rolId: string;
  rolName: string;
  data: Item[];
}

export interface FrontendURL {
  subject: string;
  object: string;
  action: string;
}

export interface URLFrontendByRole {
  id: string;
  data: FrontendURL[];
}
