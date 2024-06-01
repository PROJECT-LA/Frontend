import { optionType } from "@/components/forms/FormInputDropdown";

export interface PoliticsCRUDType {
  subject: string;
  subjectName: string;
  object: string;
  action: string;
  app: string;
  status: string;
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
