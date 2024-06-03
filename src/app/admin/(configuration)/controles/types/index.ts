export interface ControlType {
  id: string;
  status: string;

  oControl: string;
  oControlDescription: string;
  oControlCode: string;

  gControl: string;
  gControlDescription: string;
  gControlCode: string;

  eControl: string;
  eControlDescription: string;
  eControlCode: string;

  idTemplate: string;
}

export interface CUControlType {
  id?: string;

  oControl: string;
  oControlDescription: string;
  oControlCode: string;

  gControl: string;
  gControlDescription: string;
  gControlCode: string;

  eControl: string;
  eControlDescription: string;
  eControlCode: string;

  idTemplate: string;
}
