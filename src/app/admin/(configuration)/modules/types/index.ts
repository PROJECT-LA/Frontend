import { optionType } from "@/components/forms/FormInputDropdown";

export interface ModuleCRUDType {
  id: string;
  isSection: boolean;
  title: string;
  url?: string;
  icon?: string;
  order: string;
  description?: string;
  idModule?: string;
  status: string;
}
export interface NewCUModuleType {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  order: string;
  description?: string;
  idModule?: string;
  isSection: boolean;
}

export interface Properties {
  icon?: string;
  description?: string;
  sort: number;
}

export interface Module {
  id: string;
}

export interface CUModuleType {
  id: string;
  label: string;
  url: string;
  name: string;
  isSection: boolean;
  properties: {
    icon?: optionType;
    description?: string;
    sort: number;
  };
  state: string;
  idModule?: string;
}
