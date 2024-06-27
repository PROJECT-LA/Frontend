import { UserRolCRUDType } from "@/app/admin/(configuration)/users/types";
import { ControlGroupType } from "../../controls/types";

export type StatusCustomTab =
  | "CREADO"
  | "EN_CURSO"
  | "FINALIZADO"
  | "SUSPENDIDO";
export interface FilterCustomTab {
  id: string;
  type: StatusCustomTab;
  value: string;
}

export const ArrayFilterCustomTab: FilterCustomTab[] = [
  {
    id: "1",
    type: "CREADO",
    value: "Creados",
  },
  {
    id: "2",
    type: "EN_CURSO",
    value: "En curso",
  },
  {
    id: "3",
    type: "FINALIZADO",
    value: "Finalizados",
  },
  {
    id: "4",
    type: "SUSPENDIDO",
    value: "Suspendidos",
  },
];

export interface UserAudit {
  id: string;
  ci: string;
  names: string;
  lastNames: string;
  status: string;
}
export interface AuditData {
  id: string;

  idClient: string;
  idLevel: string;
  idTemplate: string;
  objective: string;
  status: string;
  acceptanceLevel: number;
  beginDate: string;
  finalDate: string;
  description: string;
}

export interface CUAudit {
  id?: string;

  idClient: string;
  idLevel: string;
  idTemplate: string;
  objective: string;
  beginDate: string;
  finalDate: string;
  description: string;
}

export interface CreateAudit {
  objective: string;
  description: string;
  beginDate: string;
  finalDate: string;
  idClient: string;
  idTemplate: string;
  idLevel: string;
  groupControls: ControlGroupType[];
  auditors: UserRolCRUDType[];
}

export const initialCreateAudit: CreateAudit = {
  auditors: [],
  beginDate: "",
  description: "",
  finalDate: "",
  groupControls: [],
  idClient: "",
  idLevel: "",
  idTemplate: "",
  objective: "",
};
