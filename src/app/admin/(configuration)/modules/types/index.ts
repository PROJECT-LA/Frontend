import { optionType } from "@/components/forms/FormInputDropdown";

export interface Properties {
  icon?: string;
  description?: string;
  sort: number;
}

export interface Module {
  id: string;
}

export interface ModuleCRUDType {
  id: string;
  label: string;
  url: string;
  name: string;
  isSection: boolean;
  properties: Properties;
  state: string;
  module?: Module | undefined;
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

export interface SaveModulesType {
  id: string;
  label: string;
  url: string;
  name: string;
  properties: Properties;
  state: string;
  idModule?: string;
}

/// UI Types
export interface ModulesModalType {
  module?: ModuleCRUDType | undefined | null;
  correctAction: () => void;
  cancelAction: () => void;
  modules: ModuleCRUDType[];
}
