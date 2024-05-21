"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { ParametroCRUDType } from "./types";
import { useAuth } from "@/context/AuthProvider";
import { CasbinTypes } from "@/types/utils/casbin";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import {
  delay,
  InterpreteMensajes,
  siteName,
  titleCase,
} from "@/utils/utilidades";
import { Constantes } from "@/config";
import { imprimir } from "@/utils/imprimir";
import { usePathname } from "next/navigation";
import { CriterioOrdenType } from "@/types/ordenTypes";
import CustomMensajeEstado from "@/components/estados/CustomMensajeEstado";
import { IconoTooltip } from "@/components/buttons/IconoTooltip";
import { BotonBuscar } from "@/components/buttons/SearchButton";
import { BotonOrdenar } from "@/components/buttons/BotonOrdenar";
import { IconoBoton } from "@/components/buttons/IconoBoton";
import { ordenFiltrado } from "@/utils/orden";
import { Paginacion } from "@/components/datatable/Paginacion";
import { AlertDialog } from "@/components/modales/AlertDialog";
import { CustomDialog } from "@/components/modales/CustomDialog";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { FiltroParametros } from "./ui/FiltroParametros";
import { VistaModalParametro } from "./ui/ModalParametros";
import { toast } from "sonner";
import { Edit, RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useRoles } from "@/hooks/useRoles";
import { useGlobalStore } from "@/store";

export default function ParametrosPage() {
  /// Verificación adicional para los permisos
  const pathname = usePathname();
  const { obtenerPermisosPagina } = useRoles();
  const { permisos } = useGlobalStore();
  useEffect(() => {
    obtenerPermisosPagina(pathname);
    /* eslint-disable */
  }, []);
  imprimir(permisos);
  /* Código que se debe de repetir en cada página */

  const [parametrosData, setParametrosData] = useState<ParametroCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [errorParametrosData, setErrorParametrosData] = useState<any>();

  const [modalParametro, setModalParametro] = useState(false);

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoParametro, setMostrarAlertaEstadoParametro] =
    useState(false);

  const [parametroEdicion, setParametroEdicion] = useState<
    ParametroCRUDType | undefined | null
  >();

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10);
  const [pagina, setPagina] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sesionPeticion } = useSession();
  const { permisoUsuario } = useAuth();

  const [filtroParametro, setFiltroParametro] = useState<string>("");
  const [mostrarFiltroParametros, setMostrarFiltroParametros] = useState(false);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  /// Método que muestra alerta de cambio de estado

  const editarEstadoParametroModal = (parametro: ParametroCRUDType) => {
    setParametroEdicion(parametro); // para mostrar datos de modal en la alerta
    setMostrarAlertaEstadoParametro(true); // para mostrar alerta de parametro
  };

  const cancelarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false);
    await delay(500); // para no mostrar undefined mientras el modal se cierra
    setParametroEdicion(null);
  };

  /// Método que oculta la alerta de cambio de estado y procede
  const aceptarAlertaEstadoParametro = async () => {
    setMostrarAlertaEstadoParametro(false);
    if (parametroEdicion) {
      await cambiarEstadoParametroPeticion(parametroEdicion);
    }
    setParametroEdicion(null);
  };

  /// Petición que cambia el estado de un parámetro
  const cambiarEstadoParametroPeticion = async (
    parametro: ParametroCRUDType
  ) => {
    try {
      setLoading(true);
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parameters/${parametro.id}/${
          parametro.status == "ACTIVO" ? "inactivacion" : "activacion"
        }`,
        tipo: "patch",
      });
      imprimir(`respuesta estado parametro: ${respuesta}`);
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });
      await obtenerParametrosPeticion();
    } catch (e) {
      imprimir(`Error estado parametro`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
      setLoading(false);
    }
  };

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: "codigo", nombre: "Código", ordenar: true },
    { campo: "nombre", nombre: "Nombre", ordenar: true },
    { campo: "descripcion", nombre: "Descripción", ordenar: true },
    { campo: "grupo", nombre: "Grupo", ordenar: true },
    { campo: "estado", nombre: "Estado", ordenar: true },
    { campo: "acciones", nombre: "Acciones" },
  ]);

  const contenidoTabla: Array<Array<ReactNode>> = parametrosData.map(
    (parametroData, indexParametro) => [
      <Typography
        key={`${parametroData.id}-${indexParametro}-codigo`}
        variant={"body2"}
      >{`${parametroData.code}`}</Typography>,
      <Typography
        key={`${parametroData.id}-${indexParametro}-nombre`}
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
        {permisos.permisos.update && (
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

        {permisos.permisos.update && (
          <IconoTooltip
            id={`editarParametros-${parametroData.id}`}
            name={"Parámetros"}
            titulo={"Editar"}
            color={"primary"}
            accion={() => {
              imprimir(`Editaremos`, parametroData);
              editarParametroModal(parametroData);
            }}
            icono={<Edit />}
          />
        )}
      </Grid>,
    ]
  );

  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={"accionFiltrarParametrosToggle"}
      key={"accionFiltrarParametrosToggle"}
      seleccionado={mostrarFiltroParametros}
      cambiar={setMostrarFiltroParametros}
    />,
    xs && (
      <BotonOrdenar
        id={"ordenarParametros"}
        key={`ordenarParametros`}
        label={"Ordenar parámetros"}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
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
    permisos.permisos.create && (
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

      console.log(`${Constantes.baseUrl}/parameters`);

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/parameters`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroParametro.length == 0 ? {} : { filtro: filtroParametro }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(","),
              }),
        },
      });

      setParametrosData(respuesta.data?.rows);
      setTotal(respuesta.data?.total);
      setErrorParametrosData(null);
    } catch (e) {
      imprimir(`Error al obtener parametros`, e);
      setErrorParametrosData(e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroParametro,
  ]);

  useEffect(() => {
    if (!mostrarFiltroParametros) {
      setFiltroParametro("");
    }
  }, [mostrarFiltroParametros]);

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
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
        error={!!errorParametrosData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroParametros && (
            <FiltroParametros
              filtroParametro={filtroParametro}
              accionCorrecta={(filtros) => {
                setPagina(1);
                setLimite(10);
                setFiltroParametro(filtros.parametro);
              }}
              accionCerrar={() => {
                imprimir(`👀 cerrar`);
              }}
            />
          )
        }
      />
    </>
  );
}
