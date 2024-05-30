import { ReactNode } from "react";

export interface Item {
  id: string;
  title?: string;
  description?: string;
  caption?: string;
  url?: string;
  subModule?: Array<Item>;
  icon?: string;
  breadcrumbs?: boolean;
  external?: boolean;
  target?: boolean | string;
  order?: number;

  status?: string;
}

export enum SortEnum {
  ASC = "asc",
  DESC = "desc",
}

export interface SortTypeCriteria {
  field: string;
  name: string;
  order?: SortEnum;
  sort?: boolean;
}

export const sortFilter = (sortCriteria: Array<SortTypeCriteria>) =>
  sortCriteria
    .filter((value) => value.order)
    .map((value) => (value.order == "asc" ? value.field : `-${value.field}`));

export const ToggleOrden = (
  ordenAnterior: SortEnum | undefined
): SortEnum | undefined => {
  switch (ordenAnterior) {
    case SortEnum.DESC:
      return SortEnum.ASC;
    case SortEnum.ASC:
      return undefined;
    default:
      return SortEnum.DESC;
  }
};
