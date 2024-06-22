export interface Vista1Data {
  id: string;
  groupId: string;
  aprovedLevel: number;
  status: "OPEN" | "CLOSE";
}

export const dataVista1: Vista1Data[] = [
  {
    id: "1",
    groupId: "Control de Accesos",
    aprovedLevel: 2.5,
    status: "OPEN",
  },
  {
    id: "2",
    groupId: "Control de Inventarios",
    aprovedLevel: 2.5,
    status: "OPEN",
  },
];
