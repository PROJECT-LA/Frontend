export interface ControlSpecificType {
  id: string;

  name: string;
  description: string;
  code: string;
}
export interface ControlGroupType {
  id: string;
  status: string;

  objective?: string;
  objectiveDescription?: string;
  objectiveCode?: string;
  group?: string;
  groupDescription?: string;
  groupCode?: string;

  controls: ControlSpecificType[];
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

  controls?: ControlSpecificType[];
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
