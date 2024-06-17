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
