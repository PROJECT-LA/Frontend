"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { PoliticaCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { RolType, RolType2 } from "@/types/users";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import { Button, Chip, Grid, useMediaQuery, useTheme } from "@mui/material";
import { CriterioOrdenType } from "@/types/ordenTypes";
import { IconoTooltip } from "@/components/buttons/IconTooltip";
import { imprimir } from "@/utils/imprimir";
import { BotonBuscar } from "@/components/buttons/SearchButton";
import { BotonOrdenar } from "@/components/buttons/BotonOrdenar";
import { IconoBoton } from "@/components/buttons/IconoBoton";
import { Constantes } from "@/config";

import { ordenFiltrado } from "@/utils/orden";
import { delay, InterpreteMensajes, siteName } from "@/utils/utilidades";

import { AlertDialog } from "@/components/modals/AlertDialog";
import { CustomDialog } from "@/components/modals/CustomDialog";
import { VistaModalPolitica } from "./ui/ModalPoliticas";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { Paginacion } from "@/components/datatable/Paginacion";
import { FiltroPolitica } from "./ui/FiltroPoliticas";
import { toast } from "sonner";
import { useRoles } from "@/hooks/useRoles";
import { useGlobalStore } from "@/store";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";

export default function PoliticasPage() {
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

  const [politicasData, setPoliticasData] = useState<PoliticaCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarFiltroPolitica, setMostrarFiltroPolitica] = useState(false);
  const [filtroPolitica, setFiltroPolitica] = useState<string>("");
  const [filtroApp, setFiltroApp] = useState<string>("");
  const [errorData, setErrorData] = useState<any>();
  const [modalPolitica, setModalPolitica] = useState(false);

  /// Indicador para mostrar una vista de alerta
  const [mostrarAlertaEliminarPolitica, setMostrarAlertaEliminarPolitica] =
    useState(false);

  const [politicaEdicion, setPoliticaEdicion] = useState<
    PoliticaCRUDType | undefined
  >();

  // Roles de usuario
  const [rolesData, setRolesData] = useState<RolType2[]>([]);

  const [limite, setLimite] = useState<number>(10);
  const [pagina, setPagina] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sesionPeticion } = useSession();
  const { permisoUsuario } = useAuth();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: "sujeto", nombre: "Sujeto", ordenar: true },
    { campo: "objeto", nombre: "Objeto", ordenar: true },
    { campo: "accion", nombre: "Acción", ordenar: true },
    { campo: "app", nombre: "App", ordenar: true },
    { campo: "acciones", nombre: "Acciones" },
  ]);

  const contenidoTabla: Array<Array<ReactNode>> = politicasData.map(
    (politicaData, indexPolitica) => [
      <Typography
        key={`${politicaData.subject}-${indexPolitica}-sujeto`}
        variant={"body2"}
      >{`${politicaData.subject}`}</Typography>,
      <Typography
        key={`${politicaData.object}-${indexPolitica}-objeto`}
        variant={"body2"}
      >{`${politicaData.object}`}</Typography>,
      <Grid key={`${politicaData.action}-${indexPolitica}-accion`}>
        {politicaData.action.split("|").map((itemAccion, indexAccion) => (
          <Chip
            key={`accion-${indexPolitica}-${indexAccion}`}
            label={itemAccion}
          />
        ))}
      </Grid>,
      <Typography
        key={`${politicaData.action}-${indexPolitica}-app`}
        variant={"body2"}
      >{`${politicaData.app}`}</Typography>,

      <Grid key={`${politicaData.action}-${indexPolitica}-acciones`}>
        {permisos.permisos.update && (
          <IconoTooltip
            id={`editarPolitica-${indexPolitica}`}
            titulo={"Editar"}
            color={"primary"}
            accion={() => {
              imprimir(`Editaremos`, politicaData);
              editarPoliticaModal(politicaData);
            }}
            icono={<Pencil />}
            name={"Editar política"}
          />
        )}

        {permisos.permisos.delete && (
          <IconoTooltip
            id={`eliminarPolitica-${indexPolitica}`}
            titulo={"Eliminar"}
            color={"error"}
            accion={() => {
              imprimir(`Eliminaremos`, politicaData);
              eliminarPoliticaModal(politicaData);
            }}
            icono={<Trash2 />}
            name={"Eliminar política"}
          />
        )}
      </Grid>,
    ]
  );

  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={"accionFiltrarPoliticasToggle"}
      key={"accionFiltrarPoliticasToggle"}
      seleccionado={mostrarFiltroPolitica}
      cambiar={setMostrarFiltroPolitica}
    />,
    xs && (
      <BotonOrdenar
        id={"ordenarUsuarios"}
        key={`ordenarUsuarios`}
        label={"Ordenar políticas"}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={"actualizarPolitica"}
      titulo={"Actualizar"}
      key={`accionActualizarPolitica`}
      accion={async () => {
        await obtenerPoliticasPeticion();
      }}
      icono={<RotateCcw />}
      name={"Actualizar lista de políticas"}
    />,
    permisos.permisos.create && (
      <IconoBoton
        id={"agregarPolitica"}
        key={"agregarPolitica"}
        texto={"Agregar"}
        variante={xs ? "icono" : "boton"}
        icono={"add_circle_outline"}
        descripcion={"Agregar política"}
        accion={() => {
          agregarPoliticaModal();
        }}
      />
    ),
  ];

  const obtenerPoliticasPeticion = async () => {
    try {
      setLoading(true);

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/authorization/policies`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroPolitica.length == 0 ? {} : { filtro: filtroPolitica }),
          ...(filtroApp.length == 0 ? {} : { aplicacion: filtroApp }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(","),
              }),
        },
      });
      setPoliticasData(respuesta.data?.rows);
      setTotal(respuesta.data?.total);
      setErrorData(null);
    } catch (e) {
      imprimir(`Error al obtener políticas`, e);
      setErrorData(e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
      setLoading(false);
    }
  };

  const eliminarPoliticaPeticion = async (politica: PoliticaCRUDType) => {
    try {
      setLoading(true);
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/authorization/policies`,
        tipo: "delete",
        params: {
          sujeto: politica?.subject,
          objeto: politica?.object,
          accion: politica?.action,
          app: politica?.app,
        },
      });
      imprimir(`respuesta eliminar política: ${respuesta}`);
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });

      await obtenerPoliticasPeticion();
    } catch (e) {
      imprimir(`Error al eliminar política`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
      setLoading(false);
    }
  };

  const agregarPoliticaModal = () => {
    setPoliticaEdicion(undefined);
    setModalPolitica(true);
  };
  const editarPoliticaModal = (politica: PoliticaCRUDType) => {
    setPoliticaEdicion(politica);
    setModalPolitica(true);
  };

  const cerrarModalPolitica = async () => {
    setModalPolitica(false);
    await delay(500);
    setPoliticaEdicion(undefined);
  };

  const obtenerRolesPeticion = async () => {
    try {
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/roles`,
      });
      setRolesData(respuesta.data.rows);
      setErrorData(null);
    } catch (e) {
      imprimir(`Error al obtener roles`, e);
      setErrorData(e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
    }
  };

  useEffect(() => {
    obtenerRolesPeticion().then(() => {
      obtenerPoliticasPeticion().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    filtroApp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroPolitica,
  ]);
  useEffect(() => {
    if (!mostrarFiltroPolitica) {
      setFiltroPolitica("");
      setFiltroApp("");
    }
  }, [mostrarFiltroPolitica]);

  const eliminarPoliticaModal = (politica: PoliticaCRUDType) => {
    setPoliticaEdicion(politica); // para mostrar datos de usuario en la alerta
    setMostrarAlertaEliminarPolitica(true); // para mostrar alerta de usuarios
  };

  const cancelarAlertaEliminarPolitica = () => {
    setMostrarAlertaEliminarPolitica(false);
    setPoliticaEdicion(undefined);
  };

  const aceptarAlertaEliminarPoliticas = async () => {
    setMostrarAlertaEliminarPolitica(false);
    if (politicaEdicion) {
      await eliminarPoliticaPeticion(politicaEdicion);
    }
  };

  return (
    <>
      <title>{`Políticas - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEliminarPolitica}
        titulo={"Alerta"}
        texto={`¿Está seguro de eliminar la política ${politicaEdicion?.app}-${politicaEdicion?.object}-${politicaEdicion?.subject}-${politicaEdicion?.action} ?`}
      >
        <Button onClick={cancelarAlertaEliminarPolitica}>Cancelar</Button>
        <Button onClick={aceptarAlertaEliminarPoliticas}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalPolitica}
        handleClose={cerrarModalPolitica}
        title={politicaEdicion ? "Editar política" : "Nueva política"}
      >
        <VistaModalPolitica
          politica={politicaEdicion}
          roles={rolesData}
          accionCorrecta={() => {
            cerrarModalPolitica().finally();
            obtenerPoliticasPeticion().finally();
          }}
          accionCancelar={cerrarModalPolitica}
        />
      </CustomDialog>
      <CustomDataTable
        error={!!errorData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        contenidoTabla={contenidoTabla}
        paginacion={
          <Paginacion
            pagina={pagina}
            limite={limite}
            total={total}
            cambioPagina={setPagina}
            cambioLimite={setLimite}
          />
        }
        filtros={
          mostrarFiltroPolitica && (
            <FiltroPolitica
              filtroPolitica={filtroPolitica}
              filtroApp={filtroApp}
              accionCorrecta={(filtros) => {
                setPagina(1);
                setLimite(10);
                setFiltroPolitica(filtros.buscar);
                setFiltroApp(filtros.app);
              }}
              accionCerrar={() => {}}
            />
          )
        }
      />
    </>
  );
}
