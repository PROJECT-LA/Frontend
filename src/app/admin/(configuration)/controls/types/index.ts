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

export interface CUControlGroupType {
  id?: string;

  idTemplate: string;

  objective?: string;
  objectiveDescription?: string;
  objectiveCode?: string;
  group?: string;
  groupDescription?: string;
  groupCode?: string;
}

export interface CUControlSpecificType {
  id?: string;
  idControlGroup: string;

  name: string;
  description: string;
  code: string;
}

export interface AddModalInfo {
  state: boolean;
  isGroup: boolean;
}

export const initialAddModalInfo = {
  state: false,
  isGroup: false,
};
