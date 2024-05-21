"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { ParametroCRUDType } from "./types";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import {
  delay,
  MessagesInterpreter,
  siteName,
  titleCase,
  print,
} from "@/utils";
import { CONSTANTS } from "../../../../../config";
import { CriterioOrdenType } from "@/types";
import CustomMensajeEstado from "@/components/states/CustomMensajeEstado";
import { IconoTooltip } from "@/components/buttons/IconTooltip";
import { SearchButton, SortButton } from "@/components/buttons";
import { IconoBoton } from "@/components/buttons/IconoBoton";
import { ordenFiltrado } from "@/types";
import { Paginacion } from "@/components/datatable/Paginacion";
import { AlertDialog } from "@/components/modals/AlertDialog";
import { CustomDialog } from "@/components/modals/CustomDialog";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { FiltroParametros } from "./ui/FiltroParametros";
import { VistaModalParametro } from "./ui/ModalParametros";
import { toast } from "sonner";
import { Edit, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { GlobalPermissionsProps } from "@/utils/permissions";

export default function ParametersClient({
  permissions,
}: GlobalPermissionsProps) {
  const [parametersData, setParametersData] = useState<ParametroCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [errorParametersData, setErrorParametersData] = useState<any>();

  const [modalParametro, setModalParametro] = useState(false);

  const [mostrarAlertaEstadoParametro, setMostrarAlertaEstadoParametro] =
    useState(false);

  const [parametroEdicion, setParametroEdicion] = useState<
    ParametroCRUDType | undefined | null
  >();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sessionRequest } = useSession();

  const [filtroParametro, setFiltroParametro] = useState<string>("");
  const [mostrarFiltroParametros, setMostrarFiltroParametros] = useState(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const editarEstadoParametroModal = (parametro: ParametroCRUDType) => {
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
    parametro: ParametroCRUDType
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

  const [orderCriteria, setOrderCriteria] = useState<Array<CriterioOrdenType>>([
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

      <CustomMensajeEstado
        key={`${parametroData.id}-${indexParametro}-estado`}
        titulo={parametroData.status}
        descripcion={parametroData.status}
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
          <IconoTooltip
            id={`cambiarEstadoParametro-${parametroData.id}`}
            titulo={parametroData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={parametroData.status == "ACTIVO" ? "success" : "error"}
            accion={async () => {
              await editarEstadoParametroModal(parametroData);
            }}
            desactivado={parametroData.status == "PENDIENTE"}
            icono={
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
          <IconoTooltip
            id={`editarParametros-${parametroData.id}`}
            name={"Parámetros"}
            titulo={"Editar"}
            color={"primary"}
            accion={() => {
              print(`Editaremos`, parametroData);
              editarParametroModal(parametroData);
            }}
            icono={<Edit />}
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
    <IconoTooltip
      id={"actualizarParametro"}
      titulo={"Actualizar"}
      key={`accionActualizarParametro`}
      accion={async () => {
        await obtenerParametrosPeticion();
      }}
      icono={<RotateCcw />}
      name={"Actualizar lista de parámetros"}
    />,
    permissions.create && (
      <IconoBoton
        id={"agregarParametro"}
        key={"agregarParametro"}
        texto={"Agregar"}
        variante={xs ? "icono" : "boton"}
        icono={"add_circle_outline"}
        descripcion={"Agregar parámetro"}
        accion={() => {
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
          ...(ordenFiltrado(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: ordenFiltrado(orderCriteria).join(","),
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
  const editarParametroModal = (parametro: ParametroCRUDType) => {
    setParametroEdicion(parametro);
    setModalParametro(true);
  };

  const cerrarModalParametro = async () => {
    setModalParametro(false);
    await delay(500);
    setParametroEdicion(undefined);
  };

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
    <Paginacion
      pagina={page}
      limite={limit}
      total={total}
      cambioPagina={setPage}
      cambioLimite={setLimit}
    />
  );

  return (
    <>
      <title>{`Parámetros - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoParametro}
        titulo={"Alerta"}
        texto={`¿Está seguro de ${
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
        <VistaModalParametro
          parametro={parametroEdicion}
          accionCorrecta={() => {
            cerrarModalParametro().finally();
            obtenerParametrosPeticion().finally();
          }}
          accionCancelar={cerrarModalParametro}
        />
      </CustomDialog>
      <CustomDataTable
        titulo="Parámetros"
        error={!!errorParametersData}
        cargando={loading}
        acciones={acciones}
        columnas={orderCriteria}
        cambioOrdenCriterios={setOrderCriteria}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroParametros && (
            <FiltroParametros
              filtroParametro={filtroParametro}
              accionCorrecta={(filtros) => {
                setPage(1);
                setLimit(10);
                setFiltroParametro(filtros.parametro);
              }}
              accionCerrar={() => {
                print(`👀 cerrar`);
              }}
            />
          )
        }
      />
    </>
  );
}
