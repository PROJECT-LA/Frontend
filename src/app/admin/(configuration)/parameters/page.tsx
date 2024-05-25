"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { ParameterCRUDType } from "./types";
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
import { FilterParameter, ParameterModalView } from "./ui";
import { toast } from "sonner";
import {
  CirclePlus,
  Edit,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  GlobalPermissionsProps,
  PermissionTypes,
  initialPermissions,
} from "@/utils/permissions";

export default function ParametersClient() {
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);

  const [parametersData, setParametersData] = useState<ParameterCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorParametersData, setErrorParametersData] = useState<any>();

  const [modalParametro, setModalParametro] = useState(false);

  const [mostrarAlertaEstadoParametro, setMostrarAlertaEstadoParametro] =
    useState(false);

  const [parametroEdicion, setParametroEdicion] = useState<
    ParameterCRUDType | undefined | null
  >();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sessionRequest, getPermissions } = useSession();

  const [filtroParametro, setFiltroParametro] = useState<string>("");
  const [mostrarFiltroParametros, setMostrarFiltroParametros] = useState(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const editarEstadoParametroModal = (parametro: ParameterCRUDType) => {
    setParametroEdicion(parametro);
    setMostrarAlertaEstadoParametro(true);
  };

  const cancelarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false);
    await delay(500);
    setParametroEdicion(null);
  };

  const aceptarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false);
    if (parametroEdicion) {
      await cambiarEstadoParametroPeticion(parametroEdicion);
    }
    setParametroEdicion(null);
  };

  const cambiarEstadoParametroPeticion = async (
    parametro: ParameterCRUDType
  ) => {
    try {
      setLoading(true);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/parameters/${parametro.id}/${
          parametro.status == "ACTIVO" ? "inactivacion" : "activacion"
        }`,
        type: "patch",
      });
      print(`respuesta estado parametro: ${respuesta}`);
      toast.success("Éxito", { description: MessagesInterpreter(respuesta) });
      await obtenerParametrosPeticion();
    } catch (e) {
      print(`Error estado parametro`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "codigo", name: "Código", sort: true },
    { field: "name", name: "Nombre", sort: true },
    { field: "descripcion", name: "Descripción", sort: true },
    { field: "grupo", name: "Grupo", sort: true },
    { field: "estado", name: "Estado", sort: true },
    { field: "acciones", name: "Acciones" },
  ]);

  const contenidoTabla: Array<Array<ReactNode>> = parametersData.map(
    (parametroData, indexParametro) => [
      <Typography
        key={`${parametroData.id}-${indexParametro}-codigo`}
        variant={"body2"}
      >{`${parametroData.code}`}</Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-name`}
        variant={"body2"}
      >
        {`${parametroData.name}`}
      </Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-descripcion`}
        variant={"body2"}
      >{`${parametroData.description}`}</Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-grupo`}
        variant={"body2"}
      >{`${parametroData.group}`}</Typography>,

      <CustomMessageState
        key={`${parametroData.id}-${indexParametro}-estado`}
        title={parametroData.status}
        description={parametroData.status}
        color={
          parametroData.status == "ACTIVO"
            ? "success"
            : parametroData.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,

      <Grid key={`${parametroData.id}-${indexParametro}-acciones`}>
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoParametro-${parametroData.id}`}
            title={parametroData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={parametroData.status == "ACTIVO" ? "success" : "error"}
            action={async () => {
              await editarEstadoParametroModal(parametroData);
            }}
            deactivate={parametroData.status == "PENDIENTE"}
            icon={
              parametroData.status == "ACTIVO" ? (
                <ToggleRight />
              ) : (
                <ToggleLeft />
              )
            }
            name={
              parametroData.status == "ACTIVO"
                ? "Inactivar Parámetro"
                : "Activar Parámetro"
            }
          />
        )}

        {permissions.update && (
          <IconTooltip
            id={`editarParametros-${parametroData.id}`}
            name={"Parámetros"}
            title={"Editar"}
            color={"primary"}
            action={() => {
              print(`Editaremos`, parametroData);
              editarParametroModal(parametroData);
            }}
            icon={<Edit />}
          />
        )}
      </Grid>,
    ]
  );

  const acciones: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarParametrosToggle"}
      key={"accionFiltrarParametrosToggle"}
      selected={mostrarFiltroParametros}
      change={setMostrarFiltroParametros}
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
        await obtenerParametrosPeticion();
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
          agregarParametroModal();
        }}
      />
    ),
  ];

  const obtenerParametrosPeticion = async () => {
    try {
      setLoading(true);
      console.log(`${CONSTANTS.baseUrl}/parameters`);

      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/parameters`,
        params: {
          page,
          limit,
          ...(filtroParametro.length == 0 ? {} : { filter: filtroParametro }),
          ...(sortFilter(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: sortFilter(orderCriteria).join(","),
              }),
        },
      });
      setParametersData(respuesta.data?.rows);
      setTotal(respuesta.data?.total);
      setErrorParametersData(null);
    } catch (e) {
      print(`Error al obtener parametros`, e);
      setErrorParametersData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const agregarParametroModal = () => {
    setParametroEdicion(undefined);
    setModalParametro(true);
  };
  const editarParametroModal = (parametro: ParameterCRUDType) => {
    setParametroEdicion(parametro);
    setModalParametro(true);
  };

  const cerrarModalParametro = async () => {
    setModalParametro(false);
    await delay(500);
    setParametroEdicion(undefined);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/parameters");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    obtenerParametrosPeticion().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
    filtroParametro,
  ]);

  useEffect(() => {
    if (!mostrarFiltroParametros) {
      setFiltroParametro("");
    }
  }, [mostrarFiltroParametros]);

  const paginacion = (
    <Pagination
      page={page}
      limit={limit}
      total={total}
      changePage={setPage}
      changeLimit={setLimit}
    />
  );

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaEstadoParametro}
        title={"Alerta"}
        text={`¿Está seguro de ${
          parametroEdicion?.status == "ACTIVO" ? "inactivar" : "activar"
        } el parámetro: ${titleCase(parametroEdicion?.name ?? "")} ?`}
      >
        <Button onClick={cancelarAlertaEstadoParametro}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoParametro}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalParametro}
        handleClose={cerrarModalParametro}
        title={parametroEdicion ? "Editar parámetro" : "Nuevo parámetro"}
      >
        <ParameterModalView
          parameter={parametroEdicion}
          correctAction={() => {
            cerrarModalParametro().finally();
            obtenerParametrosPeticion().finally();
          }}
          cancelAction={cerrarModalParametro}
        />
      </CustomDialog>
      <CustomDataTable
        title="Parámetros"
        error={!!errorParametersData}
        loading={loading}
        actions={acciones}
        columns={orderCriteria}
        changeOrderCriteria={setOrderCriteria}
        pagination={paginacion}
        tableContent={contenidoTabla}
        filters={
          mostrarFiltroParametros && (
            <FilterParameter
              filterParameter={filtroParametro}
              correctAction={(filters) => {
                setPage(1);
                setLimit(10);
                setFiltroParametro(filters.parameter);
              }}
              closeAction={() => {
                print(`👀 cerrar`);
              }}
            />
          )
        }
      />
    </>
  );
}
