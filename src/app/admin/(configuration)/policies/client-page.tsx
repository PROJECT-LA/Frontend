"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { PoliticsCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { RolType } from "../users/types";
import { useAuth } from "@/context/AuthProvider";
import { print, MessagesInterpreter, siteName, delay } from "@/utils";
import { Button, Chip, Grid, useMediaQuery, useTheme } from "@mui/material";
import { SortTypeCriteria, sortFilter } from "@/types";
import { IconTooltip, SearchButton, OwnIconButton } from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { UsersModalView } from "../users/ui/UsersModal";
import { Pagination } from "@/components/datatable";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { PoliticsFilter } from "./ui/PoliticsFilter";
import { toast } from "sonner";
import { useGlobalStore } from "@/store";
import { CirclePlus, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { GlobalPermissionsProps } from "@/utils/permissions";
import { PoliticModalView } from "./ui";

export default function PoliticsPage({ permissions }: GlobalPermissionsProps) {
  const [policiesData, setPoliciesData] = useState<PoliticsCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPolicyFilter, setShowPolicyFilter] = useState(false);
  const [filterPolicy, setFilterPolicy] = useState<string>("");
  const [filterApp, setFilterApp] = useState<string>("");
  const [errorData, setErrorData] = useState<any>();
  const [modalPolicy, setModalPolicy] = useState(false);

  const [showAlertDeletePolicy, setShowAlertDeletePolicy] = useState(false);

  const [policyEdition, setPolicyEdition] = useState<
    PoliticsCRUDType | undefined
  >();

  const [rolesData, setRolesData] = useState<RolType[]>([]);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sessionRequest } = useSession();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [ordenCriterios, setOrdenCriterios] = useState<Array<SortTypeCriteria>>(
    [
      { field: "sujeto", name: "Sujeto", sort: true },
      { field: "objeto", name: "Objeto", sort: true },
      { field: "accion", name: "Acción", sort: true },
      { field: "app", name: "App", sort: true },
      { field: "acciones", name: "Acciones" },
    ]
  );

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
        {permissions.update && (
          <IconTooltip
            id={`editarPolitica-${indexPolitica}`}
            title={"Editar"}
            color={"primary"}
            action={() => {
              print(`Editaremos`, politicaData);
              editarPoliticaModal(politicaData);
            }}
            icon={<Pencil />}
            name={"Editar política"}
          />
        )}

        {permissions.delete && (
          <IconTooltip
            id={`eliminarPolitica-${indexPolitica}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              print(`Eliminaremos`, politicaData);
              eliminarPoliticaModal(politicaData);
            }}
            icon={<Trash2 />}
            name={"Eliminar política"}
          />
        )}
      </Grid>,
    ]
  );

  const acciones: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarPoliticasToggle"}
      key={"accionFiltrarPoliticasToggle"}
      selected={showPolicyFilter}
      change={setShowPolicyFilter}
    />,
    xs && (
      <SearchButton
        id={"ordenarUsuarios"}
        key={`ordenarUsuarios`}
        label={"Ordenar políticas"}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconTooltip
      id={"actualizarPolitica"}
      title={"Actualizar"}
      key={`accionActualizarPolitica`}
      action={async () => {
        await obtenerPoliticasPeticion();
      }}
      icon={<RotateCcw />}
      name={"Actualizar lista de políticas"}
    />,
    permissions.create && (
      <OwnIconButton
        id={"agregarPolitica"}
        key={"agregarPolitica"}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        icon={<CirclePlus />}
        description={"Agregar política"}
        action={() => {
          agregarPoliticaModal();
        }}
      />
    ),
  ];

  const obtenerPoliticasPeticion = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/authorization/policies`,
        params: {
          pagina: page,
          limite: limit,
          ...(filterPolicy.length == 0 ? {} : { filter: filterPolicy }),
          ...(filterApp.length == 0 ? {} : { aplicacion: filterApp }),
          ...(sortFilter(ordenCriterios).length == 0
            ? {}
            : {
                orden: sortFilter(ordenCriterios).join(","),
              }),
        },
      });
      setPoliciesData(res.data?.rows);
      setTotal(res.data?.total);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener políticas`, e);
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const eliminarPoliticaPeticion = async (politica: PoliticsCRUDType) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/authorization/policies`,
        type: "delete",
        params: {
          sujeto: politica?.subject,
          objeto: politica?.object,
          accion: politica?.action,
          app: politica?.app,
        },
      });
      print(`respuesta eliminar política: ${res}`);
      toast.success("Éxito", { description: MessagesInterpreter(res) });
      await obtenerPoliticasPeticion();
    } catch (e) {
      print(`Error al eliminar política`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const agregarPoliticaModal = () => {
    setPolicyEdition(undefined);
    setModalPolicy(true);
  };
  const editarPoliticaModal = (politica: PoliticsCRUDType) => {
    setPolicyEdition(politica);
    setModalPolicy(true);
  };

  const cerrarModalPolitica = async () => {
    setModalPolicy(false);
    await delay(500);
    setPolicyEdition(undefined);
  };

  const obtenerRolesPeticion = async () => {
    try {
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      setRolesData(respuesta.data.rows);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener roles`, e);
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
    }
  };

  useEffect(() => {
    obtenerRolesPeticion().then(() => {
      obtenerPoliticasPeticion().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    filterApp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filterPolicy,
  ]);
  useEffect(() => {
    if (!showPolicyFilter) {
      setFilterPolicy("");
      setFilterApp("");
    }
  }, [showPolicyFilter]);

  const eliminarPoliticaModal = (politica: PoliticsCRUDType) => {
    setPolicyEdition(politica);
    setShowAlertDeletePolicy(true);
  };

  const cancelarAlertaEliminarPolitica = () => {
    setShowAlertDeletePolicy(false);
    setPolicyEdition(undefined);
  };

  const aceptarAlertaEliminarPoliticas = async () => {
    setShowAlertDeletePolicy(false);
    if (policyEdition) {
      await eliminarPoliticaPeticion(policyEdition);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={showAlertDeletePolicy}
        title={"Alerta"}
        text={`¿Está seguro de eliminar la política ${policyEdition?.app}-${policyEdition?.object}-${policyEdition?.subject}-${policyEdition?.action} ?`}
      >
        <Button onClick={cancelarAlertaEliminarPolitica}>Cancelar</Button>
        <Button onClick={aceptarAlertaEliminarPoliticas}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalPolicy}
        handleClose={cerrarModalPolitica}
        title={policyEdition ? "Editar política" : "Nueva política"}
      >
        <PoliticModalView
          politic={policyEdition}
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
        loading={loading}
        actions={acciones}
        columns={ordenCriterios}
        changeOrderCriteria={setOrdenCriterios}
        tableContent={contenidoTabla}
        pagination={
          <Pagination
            page={page}
            limit={limit}
            total={total}
            changePage={setPage}
            changeLimit={setLimit}
          />
        }
        filters={
          showPolicyFilter && (
            <PoliticsFilter
              filterPolitic={filterPolicy}
              filterApp={filterApp}
              correctAction={(filter) => {
                setPage(1);
                setLimit(10);
                setFilterPolicy(filter.search);
                setFilterApp(filter.app);
              }}
              closeAction={() => {}}
            />
          )
        }
      />
    </>
  );
}
