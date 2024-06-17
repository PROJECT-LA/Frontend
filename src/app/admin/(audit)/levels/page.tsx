"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { delay, MessagesInterpreter, titleCase, print } from "@/utils";
import { CONSTANTS } from "../../../../../config";
import { SortTypeCriteria, sortFilter } from "@/types";
import { CustomMessageState } from "@/components/states";
import {
  SearchButton,
  SortButton,
  IconTooltip,
  OwnIconButton,
} from "@/components/buttons";
import { Pagination } from "@/components/datatable";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { toast } from "sonner";
import {
  CirclePlus,
  Edit,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { LevelData } from "./types";
import { FilterLevels, LevelsModalView } from "./ui";

export default function Levels() {
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);

  const [levelsData, setLevelsData] = useState<LevelData[]>([]);
  const [levelEdition, setLevelEdition] = useState<LevelData | undefined>();

  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  /********************MODALS*****************************/
  const [alertStateLevel, setAlertStateLevel] = useState<boolean>(false);
  const [alertDeleteLevel, setAlertDeleteLevel] = useState<boolean>(false);
  const [modalLevel, setModalLevel] = useState<boolean>(false);
  /********************MODALS*****************************/

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchLevels, setSearchLevels] = useState<string>("");
  const [showFilterLevels, setShowFilterLevels] = useState(false);

  const { sessionRequest, getPermissions } = useSession();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "description", name: "Descripción" },
    { field: "level", name: "Nivel" },
    { field: "estado", name: "Estado" },
    { field: "acciones", name: "Acciones" },
  ]);

  const contenidoTabla: Array<Array<ReactNode>> = levelsData.map(
    (levelData, indexLevel) => [
      <Typography
        key={`${levelData.id}-${indexLevel}-description`}
        variant={"body2"}
      >{`${levelData.description}`}</Typography>,
      <Typography key={`${levelData.id}-${indexLevel}-level`} variant={"body2"}>
        {`${levelData.level}`}
      </Typography>,

      <CustomMessageState
        key={`${levelData.id}-${indexLevel}-estado`}
        title={levelData.status}
        description={levelData.status}
        color={
          levelData.status == "ACTIVO"
            ? "success"
            : levelData.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,

      <Grid
        container
        key={`${levelData.id}-${indexLevel}-acciones`}
        justifyContent="flex-end"
        spacing={1}
      >
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoParametro-${levelData.id}`}
            title={levelData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={levelData.status == "ACTIVO" ? "success" : "error"}
            action={async () => {
              // await editarEstadoParametroModal(levelData);
            }}
            deactivate={levelData.status == "PENDIENTE"}
            icon={
              levelData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
            }
            name={
              levelData.status == "ACTIVO"
                ? "Inactivar Parámetro"
                : "Activar Parámetro"
            }
          />
        )}

        {permissions.update && (
          <IconTooltip
            id={`editarParametros-${levelData.id}`}
            name={"Parámetros"}
            title={"Editar"}
            color={"primary"}
            action={() => {
              print(`Editaremos`, levelData);
              editLevelModal(levelData);
              // editarParametroModal(levelData);
            }}
            icon={<Edit />}
          />
        )}
        {permissions.delete && (
          <IconTooltip
            id={`eliminar-nivel-${indexLevel}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              deleteLevelModal(levelData);
            }}
            icon={<Trash2 />}
            name={"Eliminar nivel"}
          />
        )}
      </Grid>,
    ]
  );

  const actions: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarParametrosToggle"}
      key={"accionFiltrarParametrosToggle"}
      selected={showFilterLevels}
      change={setShowFilterLevels}
    />,
    xs && (
      <SortButton
        id={"ordenarParametros"}
        key={`ordenarParametros`}
        label={"Ordenar parámetros"}
        criterios={orderCriteria}
        cambioCriterios={setOrderCriteria}
      />
    ),
    <IconTooltip
      id={"actualizarParametro"}
      title={"Actualizar"}
      key={`accionActualizarParametro`}
      action={async () => {
        await getLevelsRequest();
      }}
      icon={<RotateCcw />}
      name={"Actualizar lista de parámetros"}
    />,
    permissions.create && (
      <OwnIconButton
        id={"agregarParametro"}
        key={"agregarParametro"}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        icon={<CirclePlus />}
        description={"Agregar parámetro"}
        action={() => {
          addLevelModal();
        }}
      />
    ),
  ];

  /*************************REQUEST**********************/
  const getLevelsRequest = async () => {
    try {
      setLoading(true);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/levels`,
        params: {
          page,
          limit,
          ...(searchLevels.length == 0 ? {} : { filter: searchLevels }),
          ...(sortFilter(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: sortFilter(orderCriteria).join(","),
              }),
        },
      });
      setLevelsData(respuesta.data?.rows);
      setTotal(respuesta.data?.total);
      setErrorData(null);
    } catch (e) {
      setErrorData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };
  const deleteLevelRequest = async (level: LevelData) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/levels/${level.id}`,
        type: "delete",
      });
      await getLevelsRequest();
      toast.success(MessagesInterpreter(res));
    } catch (e) {
      setErrorData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/levels");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getLevelsRequest().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
    searchLevels,
  ]);

  useEffect(() => {
    if (!showFilterLevels) {
      setSearchLevels("");
    }
  }, [showFilterLevels]);
  /*************************REQUEST**********************/

  const pagination = (
    <Pagination
      page={page}
      limit={limit}
      total={total}
      changePage={setPage}
      changeLimit={setLimit}
    />
  );

  /*********************METHODS*****************/
  const deleteLevelModal = (level: LevelData) => {
    setLevelEdition(level);
    setAlertDeleteLevel(true);
  };
  const cancelDeleteLevelModal = () => {
    setLevelEdition(undefined);
    setAlertDeleteLevel(false);
  };
  const acceptDeleteLevelModal = async () => {
    if (levelEdition !== undefined) {
      await deleteLevelRequest(levelEdition);
    }
    setLevelEdition(undefined);
    setAlertDeleteLevel(false);
  };

  const addLevelModal = () => {
    setModalLevel(true);
  };
  const closeLevelModal = () => {
    setModalLevel(false);
  };

  const acceptAlertLevelState = () => {
    setAlertStateLevel(false);
  };
  const cancelAlertLevelState = () => {
    setAlertStateLevel(false);
  };

  const closeCreateEditLevelModal = async () => {
    setLevelEdition(undefined);
    setModalLevel(false);
  };

  const editLevelModal = (level: LevelData) => {
    setLevelEdition(level);
    setModalLevel(true);
  };
  /*********************METHODS*****************/

  return (
    <>
      <AlertDialog
        isOpen={alertDeleteLevel}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el nivel "${levelEdition?.description}"?`}
      >
        <Button onClick={cancelDeleteLevelModal}>Cancelar</Button>
        <Button onClick={acceptDeleteLevelModal}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={alertStateLevel}
        title={"Alerta"}
        text={`¿Está seguro de ${
          levelEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } el parámetro: ${titleCase(levelEdition?.description ?? "")} ?`}
      >
        <Button onClick={cancelAlertLevelState}>Cancelar</Button>
        <Button onClick={acceptAlertLevelState}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalLevel}
        handleClose={closeLevelModal}
        title={levelEdition ? "Editar nivel" : "Nuevo nivel"}
      >
        <LevelsModalView
          level={levelEdition}
          correctAction={() => {
            closeCreateEditLevelModal().finally();
            getLevelsRequest().finally;
          }}
          cancelAction={closeCreateEditLevelModal}
        />
      </CustomDialog>
      <CustomDataTable
        title="Niveles"
        error={!!errorData}
        loading={loading}
        actions={actions}
        columns={orderCriteria}
        changeOrderCriteria={setOrderCriteria}
        pagination={pagination}
        tableContent={contenidoTabla}
        filters={
          showFilterLevels && (
            <FilterLevels
              filterLevel={searchLevels}
              correctAction={() => {}}
              closeAction={() => {}}
            />
            // <FilterParameter
            //   filterParameter={filtroParametro}
            //   correctAction={(filters) => {
            //     setPage(1);
            //     setLimit(10);
            //     setFiltroParametro(filters.parameter);
            //   }}
            //   closeAction={() => {
            //     print(`👀 cerrar`);
            //   }}
            // />
          )
        }
      />
    </>
  );
}
