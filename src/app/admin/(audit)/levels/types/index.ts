export interface LevelData {
  id: string;
  status: string;
  level: number;
  description: string;
}

export interface CULevel {
  id: string;
  level: number;
  description: string;
}
export type StatusLevelFilter = "active" | "inactive" | "none";
export interface LevelFilter {
  level: string;
  status: StatusLevelFilter;
}
