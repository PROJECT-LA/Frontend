"use client";
import { useState, useEffect, ReactNode } from "react";
import { CONSTANTS } from "../../../../../config";
import { Pagination } from "@/components/datatable";
import {
  SearchButton,
  SortButton,
  OwnIconButton,
  IconTooltip,
} from "@/components/buttons";
import { CustomMessageState } from "@/components/states";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { SortTypeCriteria } from "@/types";
import { RolCRUDType } from "./types";
import {
  print,
  MessagesInterpreter,
  delay,
  siteName,
  titleCase,
} from "@/utils";
import { sortFilter } from "@/types";
import {
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "sonner";
import { RoleModalView } from "./ui/RoleModal";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { RoleFilter } from "./ui/RoleFilter";
import { usePathname } from "next/navigation";
import {
  CirclePlus,
  Edit,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  GlobalPermissionsProps,
  PermissionTypes,
  initialPermissions,
} from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";

const RolesClient = () => {
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const { sessionRequest, getPermissions } = useSession();
  const [rolesData, setRolesData] = useState<RolCRUDType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorRoleData, setErrorRoleData] = useState<any>();

  const [modalRole, setModalRole] = useState(false);

  const [roleEdition, setRoleEdition] = useState<RolCRUDType | undefined>();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [roleFilter, setRoleFilter] = useState<string>("");
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showAlertStateRole, setShowAlertStateRole] = useState(false);

  const editarEstadoRolModal = (rol: RolCRUDType) => {
    setRoleEdition(rol);
    setShowAlertStateRole(true);
  };

  const cancelarAlertaEstadoRol = async () => {
    setShowAlertStateRole(false);
    await delay(500);
    setRoleEdition(undefined);
  };

  const aceptarAlertaEstadoRol = async () => {
    setShowAlertStateRole(false);
    if (roleEdition) {
      await cambiarEstadoRolPeticion(roleEdition);
    }
    setRoleEdition(undefined);
  };

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "rol", name: "Rol" },
    { field: "nombre", name: "Nombre" },
    { field: "estado", name: "Estado" },
    { field: "actions", name: "Acciones" },
  ]);

  const contentTable: Array<Array<ReactNode>> = rolesData.map(
    (rolData, indexRol) => [
      <Typography key={`${rolData.id}-${indexRol}-rol`} variant={"body2"}>
        {`${rolData.name}`}
      </Typography>,
      <Typography
        key={`${rolData.id}-${indexRol}-nombre`}
        variant={"body2"}
      >{`${rolData.name}`}</Typography>,
      <Typography key={`${rolData.id}-${indexRol}-estado`} component={"div"}>
        <CustomMessageState
          title={rolData.status}
          description={rolData.status}
          color={
            rolData.status == "ACTIVO"
              ? "success"
              : rolData.status == "INACTIVO"
              ? "error"
              : "info"
          }
        />
      </Typography>,
      <Grid key={`${rolData.id}-${indexRol}-accion`}>
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoRol-${rolData.id}`}
            title={rolData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={rolData.status == "ACTIVO" ? "success" : "error"}
            action={() => {
              editarEstadoRolModal(rolData);
            }}
            deactivate={rolData.status == "PENDIENTE"}
            icon={rolData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />}
            name={rolData.status == "ACTIVO" ? "Inactivar Rol" : "Activar Rol"}
          />
        )}
        {permissions.update && (
          <IconTooltip
            id={`editarRol-${rolData.id}`}
            title={"Editar"}
            color={"primary"}
            action={() => {
              editarRolModal(rolData);
            }}
            icon={<Edit />}
            name={"Roles"}
          />
        )}
      </Grid>,
    ]
  );

  const actions: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarRolToggle"}
      key={"accionFiltrarRolToggle"}
      selected={showRoleFilter}
      change={setShowRoleFilter}
    />,
    xs && (
      <SortButton
        id={"ordenarRoles"}
        key={`ordenarRoles`}
        label={"Ordenar roles"}
        criterios={orderCriteria}
        cambioCriterios={setOrderCriteria}
      />
    ),
    <IconTooltip
      id={"actualizarRol"}
      title={"Actualizar"}
      key={`accionActualizarRol`}
      action={async () => {
        await obtenerRolesPeticion();
      }}
      icon={<RefreshCcw />}
      name={"Actualizar lista de roles"}
    />,
    permissions.create && (
      <OwnIconButton
        id={"agregarRol"}
        key={"agregarRol"}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        icon={<CirclePlus />}
        description={"Agregar rol"}
        action={() => {
          agregarRolModal();
        }}
      />
    ),
  ];

  useEffect(() => {
    obtenerRolesPeticion().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
    roleFilter,
  ]);

  const cambiarEstadoRolPeticion = async (rol: RolCRUDType) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles/${rol.id}/${
          rol.status == "ACTIVO" ? "inactivacion" : "activacion"
        }`,
        type: "patch",
      });
      toast.success(MessagesInterpreter(res));
      await obtenerRolesPeticion();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const obtenerRolesPeticion = async () => {
    try {
      setLoading(true);

      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
        params: {
          page,
          limit,
          ...(roleFilter.length == 0 ? {} : { filtro: roleFilter }),
          ...(sortFilter(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: sortFilter(orderCriteria).join(","),
              }),
        },
      });

      setRolesData(respuesta.data?.rows);
      setTotal(respuesta.data?.total);
      setErrorRoleData(null);
    } catch (e) {
      setErrorRoleData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const agregarRolModal = () => {
    setRoleEdition(undefined);
    setModalRole(true);
  };
  const editarRolModal = (Rol: RolCRUDType) => {
    setRoleEdition(Rol);
    setModalRole(true);
  };

  const cerrarModalRol = async () => {
    setModalRole(false);
    await delay(500);
    setRoleEdition(undefined);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/roles");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showRoleFilter) {
      setRoleFilter("");
    }
  }, [showRoleFilter]);

  const pagination = (
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
        isOpen={showAlertStateRole}
        title={"Alerta"}
        text={`¿Está seguro de ${
          roleEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } a ${titleCase(roleEdition?.description ?? "")} ?`}
      >
        <Button onClick={cancelarAlertaEstadoRol}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoRol}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalRole}
        handleClose={cerrarModalRol}
        title={roleEdition ? "Editar rol" : "Nuevo rol"}
      >
        <RoleModalView
          role={roleEdition}
          correctAction={() => {
            cerrarModalRol().finally();
            obtenerRolesPeticion().finally();
          }}
          cancelAction={cerrarModalRol}
        />
      </CustomDialog>
      <CustomDataTable
        error={!!errorRoleData}
        loading={loading}
        actions={actions}
        columns={orderCriteria}
        changeOrderCriteria={setOrderCriteria}
        pagination={pagination}
        tableContent={contentTable}
        filters={
          showRoleFilter && (
            <RoleFilter
              roleFilter={roleFilter}
              correctAction={(filters) => {
                setPage(1);
                setLimit(10);
                setRoleFilter(filters.role);
              }}
              closeAction={() => {}}
            />
          )
        }
      />
    </>
  );
};

export default RolesClient;
