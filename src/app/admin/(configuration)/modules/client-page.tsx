import { GlobalPermissionsProps } from "@/utils/permissions";
import React, { ReactNode, useState } from "react";
import { ModuleCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { SortTypeCriteria, sortFilter } from "@/types";
import {
  ActionsButton,
  IconTooltip,
  SearchButton,
  SortButton,
} from "@/components/buttons";
import { CirclePlus, List, Menu, Pencil, RotateCw } from "lucide-react";
import { Pagination } from "@/components/datatable";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import { MessagesInterpreter, delay, titleCase } from "@/utils";
import { Icono } from "@/components/Icono";
import { CustomMessageState } from "@/components/states";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { FilterModules, ModulesModalView } from "./ui";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";

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
  const [showFilterModule, setShowFilterModule] = useState<boolean>(false);
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
  const paginacion = (
    <Pagination
      page={page}
      limit={limit}
      total={total}
      changePage={setPage}
      changeLimit={setLimit}
    />
  );
  const acciones: Array<ReactNode> = [
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
        {moduleData.properties.sort}
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
        {moduleData.module === null ? (
          <></>
        ) : (
          <Icono
            sx={{ mr: 1 }}
            color="inherit"
          >{`${moduleData.properties.icon}`}</Icono>
        )}
        <Typography
          key={`${moduleData.id}-${indexModule}-nombre`}
          component={"span"}
          variant={"body2"}
        >
          {`${moduleData.label}`}
        </Typography>
      </Box>,
      <Typography
        key={`${moduleData.id}-${indexModule}-label`}
        variant={"body2"}
      >{`${moduleData.name}`}</Typography>,
      <Typography
        key={`${moduleData.id}-${indexModule}-descripcion`}
        variant={"body2"}
      >{`${
        moduleData.properties?.description
          ? moduleData.properties.description
          : ""
      }`}</Typography>,

      <Typography key={`${moduleData.id}-${indexModule}-url`} variant={"body2"}>
        {`${moduleData.url}`}
      </Typography>,

      <CustomMessageState
        key={`${moduleData.id}-${indexModule}-estado`}
        title={moduleData.state}
        description={moduleData.state}
        color={
          moduleData.state == "ACTIVO"
            ? "success"
            : moduleData.state == "INACTIVO"
            ? "error"
            : "info"
        }
      />,
      <Grid key={`${moduleData.id}-${indexModule}-accion`}>
        <Grid key={`${moduleData.id}-${indexModule}-acciones`}>
          {permissions.update && (
            <IconTooltip
              id={`cambiarEstadoModulo-${moduleData.id}`}
              title={moduleData.state == "ACTIVO" ? "Inactivar" : "Activar"}
              color={moduleData.state == "ACTIVO" ? "success" : "error"}
              action={() => {
                editStateModuleModal({
                  ...moduleData,
                  ...{ esSeccion: moduleData?.module == null },
                });
              }}
              deactivate={moduleData.state == "PENDIENTE"}
              icon={moduleData.state == "ACTIVO" ? "toggle_on" : "toggle_off"}
              name={
                moduleData.state == "ACTIVO"
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
                editStateModuleModal({
                  ...moduleData,
                  ...{ esSeccion: moduleData?.module == null },
                });
              }}
              icon={<Pencil />}
              name={"Editar módulo"}
            />
          )}
        </Grid>
      </Grid>,
    ]
  );

  /********************************************************/

  const addModuleModal = (isSection: boolean) => {
    setModuleEdition({ isSection } as ModuleCRUDType);
    setModalModule(true);
  };
  const cancelAlertModuleState = async () => {
    setShowAlertModuleState(false);
    await delay(500);
    setModuleEdition(null);
  };
  const closeModalModule = async () => {
    setModalModule(false);
    await delay(500);
    setModuleEdition(undefined);
  };

  const acceptAlertModuleState = async () => {
    setShowAlertModuleState(false);
    if (moduleEdition) {
      await changeModuleStateRequest(moduleEdition);
    }
    setModuleEdition(null);
  };

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
      setModulesData(res.datos?.rows);
      setTotal(res.datos?.total);
      setErrorModulesData(null);
    } catch (e) {
      setErrorModulesData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };
  const getSectionsRequest = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules`,
        params: {
          page: 1,
          limit: 20,
          section: true,
        },
      });
      setSectionsData(res.datos?.rows);
    } catch (e) {
      setErrorModulesData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const changeModuleStateRequest = async (module: ModuleCRUDType) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules/${module.id}/${
          module.state == "ACTIVO" ? "inactivacion" : "activacion"
        }`,
        type: "patch",
      });
      toast.success(MessagesInterpreter(res));
      await getModulesRequest();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };
  /**********************************************************/

  const editStateModuleModal = (module: ModuleCRUDType) => {
    setModuleEdition(module);
    setShowAlertModuleState(true);
  };

  return (
    <>
      <AlertDialog
        isOpen={showAlertModuleState}
        title={"Alerta"}
        text={`¿Está seguro de ${
          moduleEdition?.state == "ACTIVO" ? "inactivar" : "activar"
        } el módulo: ${titleCase(moduleEdition?.name ?? "")} ?`}
      >
        <Button onClick={cancelAlertModuleState}>Cancelar</Button>
        <Button onClick={acceptAlertModuleState}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalModule}
        handleClose={closeModalModule}
        title={
          moduleEdition?.id
            ? moduleEdition.isSection
              ? "Editar Sección"
              : "Editar Módulo"
            : moduleEdition?.isSection
            ? "Nueva Sección"
            : "Nuevo Módulo"
        }
      >
        <ModulesModalView
          module={moduleEdition}
          correctAction={() => {
            closeModalModule().finally();
            getSectionsRequest().then(() => {
              getModulesRequest().finally();
            });
          }}
          cancelAction={closeModalModule}
          modules={sectionsData}
        />
      </CustomDialog>

      <CustomDataTable
        title={"Módulos"}
        error={!!errorModulesData}
        loading={loading}
        actions={acciones}
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

export default ModulesClient;
