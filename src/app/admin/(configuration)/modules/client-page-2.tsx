"use client";
import { useSession } from "@/hooks/useSession";
import { GlobalPermissionsProps } from "@/utils/permissions";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { ModuleCRUDType } from "./types/modulesTypes";
import { SortTypeCriteria, sortFilter } from "@/types";
import { Pagination } from "@/components/datatable";
import { Icono } from "@/components/Icono";
import { getIconLucide } from "@/types/icons";
import { CustomMessageState } from "@/components/states";
import {
  ActionsButton,
  IconTooltip,
  SearchButton,
  SortButton,
} from "@/components/buttons";
import {
  CirclePlus,
  List,
  Menu,
  Pencil,
  RotateCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import { MessagesInterpreter } from "@/utils";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { FilterModules } from "./ui";
import { CustomDialog } from "@/components/modals";
import { ModulesModalViewAlter } from "./ui/ModulesModalAlter";

const getData: ModuleCRUDType[] = [
  {
    id: "1",
    status: "ACTIVO",
    title: "Principal",
    description: "Sección principal",
    icon: null,
    order: 1,
    url: "/principal",
    module: null,
  },
  {
    id: "2",
    status: "ACTIVO",
    title: "Inicio",
    description: "Vista de bienvenida con características del sistema",
    icon: "home",
    order: 1,
    url: "/admin/home",
    module: {
      id: "1",
      title: "Principal",
      order: 1,
    },
  },
  {
    id: "3",
    status: "ACTIVO",
    title: "Perfil",
    description: "Información del perfil de usuario que inicio sesión",
    icon: "user",
    order: 2,
    url: "/admin/profile",
    module: {
      id: "1",
      title: "Principal",
      order: 1,
    },
  },
  {
    id: "4",
    status: "ACTIVO",
    title: "Configuración",
    description: "Sección de configuraciones",
    icon: null,
    order: 2,
    url: "/configuraciones",
    module: null,
  },
  {
    id: "5",
    status: "ACTIVO",
    title: "Usuarios",
    description: "Control de usuarios del sistema",
    icon: "users",
    order: 1,
    url: "/admin/users",
    module: {
      id: "4",
      title: "Configuración",
      order: 2,
    },
  },
  {
    id: "6",
    status: "ACTIVO",
    title: "Parámetros",
    description: "Parámetros generales del sistema",
    icon: "settings-2",
    order: 2,
    url: "/admin/parameters",
    module: {
      id: "4",
      title: "Configuración",
      order: 2,
    },
  },
  {
    id: "7",
    status: "ACTIVO",
    title: "Módulos",
    description: "Gestión de módulos",
    icon: "package-open",
    order: 3,
    url: "/admin/modules",
    module: {
      id: "4",
      title: "Configuración",
      order: 2,
    },
  },
  {
    id: "8",
    status: "ACTIVO",
    title: "Permisos",
    description: "Control de permisos para los usuarios",
    icon: "lock",
    order: 4,
    url: "/admin/policies",
    module: {
      id: "4",
      title: "Configuración",
      order: 2,
    },
  },
  {
    id: "9",
    status: "ACTIVO",
    title: "Roles",
    description: "Control de roles para los usuarios",
    icon: "notebook",
    order: 5,
    url: "/admin/roles",
    module: {
      id: "4",
      title: "Configuración",
      order: 2,
    },
  },
];

const ModulesClient2 = ({ permissions }: GlobalPermissionsProps) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const { sessionRequest } = useSession();
  const [modulesData, setModulesData] = useState<ModuleCRUDType[]>([]);
  const [moduleEdition, setModuleEdition] = useState<
    ModuleCRUDType | undefined | null
  >();

  const [sectionsData, setSectionsData] = useState<ModuleCRUDType[]>([]);
  const [errorModulesData, setErrorModulesData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [filterSearch, setFilterSearch] = useState<string>("");
  const [showFilterModule, setShowFilterModule] = useState<boolean>(false);

  const [modalModule, setModalModule] = useState<{
    state: boolean;
    isSection: boolean;
  }>({
    isSection: false,
    state: false,
  });

  /*****************************************************/
  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "order", name: "Orden" },
    { field: "icon", name: "Icono", sort: true },
    { field: "name", name: "Nombre", sort: true },
    { field: "descripcion", name: "Descripción" },
    { field: "url", name: "URL", sort: true },
    { field: "estado", name: "Estado", sort: true },
    { field: "acciones", name: "Acciones" },
  ]);
  const paginacion = (
    <Pagination
      page={page}
      limit={limit}
      total={total}
      changePage={setPage}
      changeLimit={setLimit}
    />
  );
  const actions: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarModuloToggle"}
      key={"accionFiltrarModuloToggle"}
      selected={showFilterModule}
      change={setShowFilterModule}
    />,
    xs && (
      <SortButton
        id={"ordenarModulos"}
        key={`ordenarModulos`}
        label={"Ordenar módulos"}
        criterios={orderCriteria}
        cambioCriterios={setOrderCriteria}
      />
    ),
    <IconTooltip
      id={`ActualizarModulo`}
      title={"Actualizar"}
      key={`ActualizarModulo`}
      action={async () => {
        await getModulesRequest();
      }}
      icon={<RotateCw />}
      name={"Actualizar lista de parámetros"}
    />,
    permissions.create && (
      <ActionsButton
        id={"agregarModuloSeccion"}
        key={"agregarModuloSeccion"}
        icon={<CirclePlus />}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        label={"Agregar nueva sección o módulo"}
        actions={[
          {
            id: "agregarModulo",
            show: true,
            title: "Nuevo módulo",
            action: () => {
              addModuleModal(false);
            },
            deactivate: false,
            icon: <Menu />,
            name: "Nuevo módulo",
          },
          {
            id: "1",
            show: true,
            title: "Nueva sección",
            action: () => {
              addModuleModal(true);
            },
            deactivate: false,
            icon: <List />,
            name: "Nueva sección",
          },
        ]}
      />
    ),
  ];
  const contentTable: Array<Array<ReactNode>> = modulesData.map(
    (moduleData, indexModule) => [
      <Typography
        key={`${moduleData.id}-${indexModule}-orden`}
        variant={"body2"}
      >
        {moduleData.order}
      </Typography>,
      <Box
        key={`${moduleData.id}-${indexModule}-nombre`}
        sx={{
          display: "flex",
          flexDirection: "row",
          borderRadius: 1,
          alignItems: "center",
        }}
      >
        {moduleData.module !== null && (
          <Icono sx={{ mr: 1 }} color="inherit">
            {getIconLucide(moduleData.icon as string)}
          </Icono>
        )}
      </Box>,
      <Typography
        key={`${moduleData.id}-${indexModule}-label`}
        variant={"body2"}
      >{`${moduleData.title}`}</Typography>,
      <Typography
        key={`${moduleData.id}-${indexModule}-descripcion`}
        variant={"body2"}
      >{`${moduleData.description ? moduleData.description : ""}`}</Typography>,

      <Typography key={`${moduleData.id}-${indexModule}-url`} variant={"body2"}>
        {`${moduleData.url}`}
      </Typography>,

      <CustomMessageState
        key={`${moduleData.id}-${indexModule}-estado`}
        title={moduleData.status}
        description={moduleData.status}
        color={
          moduleData.status == "ACTIVO"
            ? "success"
            : moduleData.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,
      <Grid key={`${moduleData.id}-${indexModule}-accion`}>
        <Grid key={`${moduleData.id}-${indexModule}-acciones`}>
          {permissions.update && (
            <IconTooltip
              id={`cambiarEstadoModulo-${moduleData.id}`}
              title={moduleData.status == "ACTIVO" ? "Inactivar" : "Activar"}
              color={moduleData.status == "ACTIVO" ? "success" : "error"}
              action={() => {}}
              deactivate={moduleData.status == "PENDIENTE"}
              icon={
                moduleData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
              }
              name={
                moduleData.status == "ACTIVO"
                  ? "Inactivar Módulo"
                  : "Activar Módulo"
              }
            />
          )}

          {permissions.update && (
            <IconTooltip
              id={`editarModulo-${moduleData.id}`}
              title={"Editar"}
              color={"primary"}
              action={() => {
                editModuleModal(moduleData, moduleData.module === null);
              }}
              icon={<Pencil />}
              name={"Editar módulo"}
            />
          )}
        </Grid>
      </Grid>,
    ]
  );

  /********************** REQUESTS *******************************/
  const getModulesRequest = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules`,
        params: {
          page,
          limit,
          ...(filterSearch.length == 0 ? {} : { filter: filterSearch }),
          ...(sortFilter(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: sortFilter(orderCriteria).join(","),
              }),
        },
      });

      setModulesData(res.data?.rows);
      setTotal(res.data?.total);
      setErrorModulesData(null);
    } catch (e) {
      setErrorModulesData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getModulesRequest();
    // getSectionsRequest().then(() => {
    //   getModulesRequest().finally(() => {});
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
    filterSearch,
  ]);

  useEffect(() => {
    if (!showFilterModule) {
      setFilterSearch("");
    }
  }, [showFilterModule]);

  /**************************************************************+ */
  const addModuleModal = (isSection: boolean) => {
    setModalModule({
      state: true,
      isSection,
    });
  };

  const editModuleModal = (module: ModuleCRUDType, isSection: boolean) => {
    setModalModule({
      state: true,
      isSection,
    });
    setModuleEdition(module);
  };
  const closeModalModule = async () => {
    setModalModule({
      state: false,
      isSection: false,
    });
    setModuleEdition(undefined);
  };

  return (
    <>
      <CustomDialog
        isOpen={modalModule.state}
        handleClose={closeModalModule}
        title={
          moduleEdition?.id
            ? modalModule.isSection
              ? "Editar Sección"
              : "Editar Módulo"
            : modalModule?.isSection
            ? "Nueva Sección"
            : "Nuevo Módulo"
        }
      >
        <ModulesModalViewAlter
          module={moduleEdition}
          isSection={modalModule.isSection}
          correctAction={() => {
            closeModalModule().finally();
            getModulesRequest().finally();
            // getSectionsRequest().then(() => {
            //   getModulesRequest().finally();
            // });
          }}
          cancelAction={closeModalModule}
          sections={sectionsData}
        />
      </CustomDialog>
      <CustomDataTable
        title={"Módulos"}
        error={!!errorModulesData}
        loading={loading}
        actions={actions}
        columns={orderCriteria}
        changeOrderCriteria={setOrderCriteria}
        pagination={paginacion}
        tableContent={contentTable}
        filters={
          showFilterModule && (
            <FilterModules
              filterModule={filterSearch}
              correctAction={(filters) => {
                setPage(1);
                setLimit(10);
                setFilterSearch(filters.search);
              }}
              closeAction={() => {}}
            />
          )
        }
      />
    </>
  );
};

export default ModulesClient2;
