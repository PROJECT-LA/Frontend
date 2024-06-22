"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { PoliticsCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { RolType } from "../users/types";
import { print, MessagesInterpreter, delay, titleCase } from "@/utils";
import { Button, Chip, Grid, useMediaQuery, useTheme } from "@mui/material";
import { SortTypeCriteria, sortFilter } from "@/types";
import {
  IconTooltip,
  SearchButton,
  OwnIconButton,
  SortButton,
} from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { Pagination } from "@/components/datatable";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { PoliticsFilter } from "./ui/PoliticsFilter";
import { toast } from "sonner";
import {
  CirclePlus,
  Pencil,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { initialPermissions, PermissionTypes } from "@/utils/permissions";
import { PoliticModalView } from "./ui";
import { CustomMessageState } from "@/components/states";

export default function PoliticsPage() {
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
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

  const { sessionRequest, getPermissions } = useSession();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [ordenCriterios, setOrdenCriterios] = useState<Array<SortTypeCriteria>>(
    [
      { field: "subject", name: "Sujeto" },
      { field: "object", name: "Objeto" },
      { field: "action", name: "Acción" },
      { field: "app", name: "App" },
      { field: "status", name: "Estado" },
      { field: "actions", name: "Acciones" },
    ]
  );

  const contenidoTabla: Array<Array<ReactNode>> = policiesData.map(
    (policyData, indexPolicy) => [
      <Typography
        key={`${policyData.subjectName}-${indexPolicy}-sujeto`}
        variant={"body2"}
      >{`${policyData.subjectName}`}</Typography>,
      <Typography
        key={`${policyData.object}-${indexPolicy}-objeto`}
        variant={"body2"}
      >{`${policyData.object}`}</Typography>,
      <Grid key={`${policyData.action}-${indexPolicy}-accion`}>
        {policyData.action.split("|").map((itemAccion, indexAccion) => (
          <Chip
            key={`accion-${indexPolicy}-${indexAccion}`}
            label={itemAccion}
          />
        ))}
      </Grid>,
      <Typography
        key={`${policyData.action}-${indexPolicy}-app`}
        variant={"body2"}
      >{`${policyData.app}`}</Typography>,

      <CustomMessageState
        key={`${policyData.object}-estado`}
        title={policyData.status}
        description={policyData.status}
        color={
          policyData.status == "ACTIVO"
            ? "success"
            : policyData.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,

      <Grid key={`${policyData.action}-${indexPolicy}-acciones`}>
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoModulo-${policyData.object}`}
            title={policyData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={policyData.status == "ACTIVO" ? "success" : "error"}
            action={() => changeStateModuleModal(policyData)}
            deactivate={policyData.status == "PENDIENTE"}
            icon={
              policyData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
            }
            name={
              policyData.status == "ACTIVO"
                ? "Inactivar Módulo"
                : "Activar Módulo"
            }
          />
        )}

        {permissions.update && (
          <IconTooltip
            id={`editarPolitica-${indexPolicy}`}
            title={"Editar"}
            color={"primary"}
            action={() => {
              print(`Editaremos`, policyData);
              editarPoliticaModal(policyData);
            }}
            icon={<Pencil />}
            name={"Editar política"}
          />
        )}

        {permissions.delete && (
          <IconTooltip
            id={`eliminarPolitica-${indexPolicy}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              print(`Eliminaremos`, policyData);
              eliminarPoliticaModal(policyData);
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
      <SortButton
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
        await getPoliciesRequest();
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

  const getPoliciesRequest = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies`,
        params: {
          page,
          limit,
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
        url: `${CONSTANTS.baseUrl}/policies`,
        type: "delete",
        params: {
          subject: politica?.subject,
          object: politica?.object,
          action: politica?.action,
          app: politica?.app,
          status: politica?.status,
        },
      });
      print(`respuesta eliminar política: ${res}`);
      toast.success("Éxito", { description: MessagesInterpreter(res) });
      await getPoliciesRequest();
    } catch (e) {
      print(`Error al eliminar política`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const changePolicyStateRequest = async (policy: PoliticsCRUDType) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies/change-status`,
        type: "patch",
        body: policy,
      });
      toast.success(MessagesInterpreter(res));
      await getPoliciesRequest();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
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

  const changeStateModuleModal = async (policies: PoliticsCRUDType) => {
    setPolicyEdition(policies);

    setShowAlertModuleState(true);
  };

  const cerrarModalPolitica = async () => {
    setModalPolicy(false);
    await delay(500);
    setPolicyEdition(undefined);
  };

  const getRolesRequest = async () => {
    try {
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      setRolesData(res.data.rows);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener roles`, e);
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
    }
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
    getRolesRequest().then(() => {
      getPoliciesRequest().finally(() => {});
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

  const acceptAlertModuleState = async () => {
    setShowAlertModuleState(false);
    if (policyEdition !== null && policyEdition !== undefined) {
      await changePolicyStateRequest(policyEdition);
    }
    setPolicyEdition(undefined);
  };

  const cancelAlertModuleState = () => {
    setShowAlertModuleState(false);
    setPolicyEdition(undefined);
  };

  return (
    <>
      <AlertDialog
        isOpen={showAlertModuleState}
        title={"Alerta"}
        text={`¿Está seguro de ${
          policyEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } la política: ${titleCase(policyEdition?.object ?? "")} ?`}
      >
        <Button onClick={cancelAlertModuleState}>Cancelar</Button>
        <Button onClick={acceptAlertModuleState}>Aceptar</Button>
      </AlertDialog>
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
            getPoliciesRequest().finally();
          }}
          accionCancelar={cerrarModalPolitica}
        />
      </CustomDialog>
      <CustomDataTable
        title={"Políticas"}
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
