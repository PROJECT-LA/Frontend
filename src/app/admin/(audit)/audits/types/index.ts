export interface FilterCustomTab {
  id: string;
  type: "ACTIVE" | "ONCOURSE" | "CLOSED";
  value: string;
}

export const ArrayFilterCustomTab: FilterCustomTab[] = [
  {
    id: "1",
    type: "ACTIVE",
    value: "Activos",
  },
  {
    id: "2",
    type: "ONCOURSE",
    value: "En curso",
  },
  {
    id: "3",
    type: "CLOSED",
    value: "Concluidos",
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
