import { optionType } from "@/components/forms/FormInputDropdown";

export interface PoliticsCRUDType {
  subject: string;
  object: string;
  action: string;
  app: string;
}

export interface CUPoliticsCRUDType {
  subject: string;
  object: string;
  action: optionType[];
  app: string;
}

export interface savePoliticCRUDType {
  subject: string;
  object: string;
  action: string;
  app: string;
}
