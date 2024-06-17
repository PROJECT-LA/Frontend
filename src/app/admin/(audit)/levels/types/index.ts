export interface LevelData {
  id: string;
  status: string;
  grade: number;
  name: string;
  description: string;
}

export interface CULevel {
  id: string;
  grade: number;
  name: string;
  description: string;
}
export type StatusLevelFilter = "active" | "inactive" | "none";
export interface LevelFilter {
  grade: string;
  name: string;
  status: StatusLevelFilter;
}
