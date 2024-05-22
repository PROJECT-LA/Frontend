import { GlobalPermissionsProps } from "@/utils/permissions";
import React, { ReactNode, useState } from "react";
import { ModuleCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { SortTypeCriteria } from "@/types";
import { IconTooltip, SearchButton, SortButton } from "@/components/buttons";

const ModulesClient = ({ permissions }: GlobalPermissionsProps) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const { sessionRequest } = useSession();

  const [modulesData, setModulesData] = useState<ModuleCRUDType[]>([]);
  const [sectionsData, setSectionsData] = useState<ModuleCRUDType[]>([]);
  const [errorModulesData, setErrorModulesData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [filterSearch, setFilterSearch] = useState<string>("");

  const [moduleEdition, setModuleEdition] = useState<
    ModuleCRUDType | undefined | null
  >();
  const [modalFilterModule, setModalFilterModule] = useState<boolean>(false);
  const [modalModule, setModalModule] = useState<boolean>(false);
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);

  /*****************************************************/
  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "label", name: "Label", sort: true },
    { field: "nombre", name: "Nombre", sort: true },
    { field: "descripcion", name: "Descripción" },
    { field: "url", name: "URL", sort: true },
    { field: "estado", name: "Estado", sort: true },
    { field: "acciones", name: "Acciones" },
  ]);
  const acciones: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarModuloToggle"}
      key={"accionFiltrarModuloToggle"}
      selected={mostrarFiltroModulo}
      change={setMostrarFiltroModulo}
    />,
    xs && (
      <SortButton
        id={"ordenarModulos"}
        key={`ordenarModulos`}
        label={"Ordenar módulos"}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconTooltip
      id={`ActualizarModulo`}
      title={"Actualizar"}
      key={`ActualizarModulo`}
      action={async () => {
        await obtenerModulosPeticion();
      }}
      icon={"refresh"}
      name={"Actualizar lista de parámetros"}
    />,
    permissions.create && (
      <BotonAcciones
        id={"agregarModuloSeccion"}
        key={"agregarModuloSeccion"}
        icono={"add_circle_outline"}
        texto={"Agregar"}
        variante={xs ? "icono" : "boton"}
        label={"Agregar nueva sección o módulo"}
        acciones={[
          {
            id: "agregarModulo",
            mostrar: true,
            titulo: "Nuevo módulo",
            accion: () => {
              addModuleModal(false);
            },
            desactivado: false,
            icono: "menu",
            name: "Nuevo módulo",
          },
          {
            id: "1",
            mostrar: true,
            titulo: "Nueva sección",
            accion: () => {
              addModuleModal(true);
            },
            desactivado: false,
            icono: "list",
            name: "Nueva sección",
          },
        ]}
      />
    ),
  ];
  /********************************************************/

  const addModuleModal = (isSection: boolean) => {
    setModuleEdition({ isSection } as ModuleCRUDType);
    setModalModule(true);
  };

  return <div>ModulesClient</div>;
};

export default ModulesClient;
