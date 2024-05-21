export interface Item {
  id: string;
  title?: string;
  type: string;
  caption?: string;
  url?: string;
  children?: Array<Item>;
  icon?: any;
  breadcrumbs?: boolean;
  external?: boolean;
  target?: boolean | string;
}

/* Para las tablas */
export enum OrdenEnum {
  ASC = "asc",
  DESC = "desc",
}

export interface CriterioOrdenType {
  field: string;
  name: string;
  order?: OrdenEnum;
  sort?: boolean;
}

export const ordenFiltrado = (ordenCriterios: Array<CriterioOrdenType>) =>
  ordenCriterios
    .filter((value) => value.order)
    .map((value) => (value.order == "asc" ? value.field : `-${value.field}`));

export const ToggleOrden = (
  ordenAnterior: OrdenEnum | undefined
): OrdenEnum | undefined => {
  switch (ordenAnterior) {
    case OrdenEnum.DESC:
      return OrdenEnum.ASC;
    case OrdenEnum.ASC:
      return undefined;
    default:
      return OrdenEnum.DESC;
  }
};