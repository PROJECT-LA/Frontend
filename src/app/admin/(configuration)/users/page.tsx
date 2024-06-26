"use client";
import Typography from "@mui/material/Typography";
import { CONSTANTS } from "../../../../../config";
import React, { ReactNode, useEffect, useState } from "react";
import { delay, MessagesInterpreter, print, titleCase } from "@/utils";
import { RolType, UserRolCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import {
  Box,
  Button,
  Chip,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { sortFilter, SortTypeCriteria } from "@/types";
import { CustomMessageState } from "@/components/states";
import {
  SortButton,
  SearchButton,
  OwnIconButton,
  IconTooltip,
} from "@/components/buttons";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { UsersFilter } from "./ui/UserFilter";
import { UsersModalView } from "./ui/UsersModal";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { Pagination } from "@/components/datatable";
import { toast } from "sonner";
import {
  CirclePlus,
  KeyRound,
  Mails,
  Pencil,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  Trash,
} from "lucide-react";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";

export default function UsersClientPage() {
  const { sessionRequest, getPermissions } = useSession();

  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [rolesData, setRolesData] = useState<RolType[]>([]);
  const [usersData, setUsersData] = useState<UserRolCRUDType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [userFilter, setUserFilter] = useState<string>("");

  const [modalUser, setModalUser] = useState(false);
  const [showAlertUserState, setShowAlertUserState] = useState(false);
  const [showAlertRestoreUser, setShowAlertRestoreUser] = useState(false);
  const [showAlertEmailResend, setShowAlertEmailResend] = useState(false);

  const [userEdition, setUserEdition] = useState<
    UserRolCRUDType | undefined | null
  >();

  const [showUsersFilter, setShowUsersFilter] = useState(false);

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "names", name: "Nombres", sort: true },
    { field: "lastNames", name: "Apellidos", sort: true },
    { field: "email", name: "Correo electrónico", sort: true },
    { field: "phone", name: "Número de telefono" },
    { field: "roles", name: "Roles" },
    { field: "status", name: "Estado", sort: true },
    { field: "acciones", name: "Acciones" },
  ]);

  const contentTable: Array<Array<ReactNode>> = usersData.map(
    (userData, indexUsuario) => [
      <div key={`${userData.id}-${indexUsuario}-nombres`}>
        <Typography variant={"body2"}>{`${userData.names}`}</Typography>
      </div>,
      <div key={`${userData.id}-${indexUsuario}-apellidos`}>
        <Typography variant={"body2"}>{`${userData.lastNames}`}</Typography>
      </div>,
      <Typography
        key={`${userData.id}-${indexUsuario}-tipoDoc`}
        variant={"body2"}
      >
        {`${userData.email}`}
      </Typography>,
      <Typography
        key={`${userData.id}-${indexUsuario}-usuario`}
        variant={"body2"}
      >
        {userData.phone}
      </Typography>,

      <Grid key={`${userData.id}-${indexUsuario}-roles`}>
        {userData.roles.map((itemUsuarioRol, indexUsuarioRol) => (
          <Chip
            key={`usuario-rol-${indexUsuarioRol}`}
            label={itemUsuarioRol.name}
          />
        ))}
      </Grid>,
      <Typography
        component={"div"}
        key={`${userData.id}-${indexUsuario}-estado`}
      >
        <CustomMessageState
          title={userData.status}
          description={userData.status}
          color={
            userData.status == "ACTIVO"
              ? "success"
              : userData.status == "INACTIVO"
              ? "error"
              : "info"
          }
        />
      </Typography>,
      <Box
        key={`${userData.id}-${indexUsuario}-acciones`}
        width="100%"
        display="flex"
        justifyContent="end"
        alignItems="end"
      >
        <Grid>
          {permissions.update && (
            <IconTooltip
              id={`editarEstadoUsuario-${userData.id}`}
              title={userData.status == "ACTIVO" ? "Inactivar" : "Activar"}
              color={userData.status == "ACTIVO" ? "success" : "error"}
              action={async () => {
                await editUserModalState(userData);
              }}
              deactivate={userData.status == "PENDIENTE"}
              icon={
                userData.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
              }
              name={
                userData.status == "ACTIVO"
                  ? "Inactivar Usuario"
                  : "Activar Usuario"
              }
            />
          )}

          {(userData.status == "ACTIVO" || userData.status == "INACTIVO") && (
            <IconTooltip
              id={`restablecerContrasena-${userData.id}`}
              title="Restablecer contraseña"
              color={"info"}
              action={async () => {
                await restoreUserModalPassword(userData);
              }}
              icon={<KeyRound />}
              name={"Restablecer contraseña"}
            />
          )}
          {userData.status == "PENDIENTE" && (
            <IconTooltip
              id={`reenviarCorreoActivacion-${userData.id}`}
              title={"Reenviar correo de activación"}
              color={"info"}
              action={async () => {
                await reenvioCorreoModal(userData);
              }}
              icon={<Mails />}
              name={"Reenviar correo de activación"}
            />
          )}
          {permissions.update && (
            <IconTooltip
              id={`editarUsusario-${userData.id}`}
              title={"Editar"}
              color={"primary"}
              action={() => {
                print(`Editaremos`, userData);
                editUserModal(userData);
              }}
              icon={<Pencil />}
              name={"Editar usuario"}
            />
          )}
          {permissions.delete && (
            <IconTooltip
              id={`eliminarUsuario-${userData.id}`}
              title={"Eliminar"}
              color={"secondary"}
              action={() => {
                print(`Eliminaremos`, userData);
                deleteAccount(userData);
              }}
              icon={<Trash />}
              name={"Eliminar cuenta"}
            />
          )}
        </Grid>
      </Box>,
    ]
  );

  const actions: Array<ReactNode> = [
    <SearchButton
      id={"accionFiltrarUsuarioToggle"}
      key={"accionFiltrarUsuarioToggle"}
      selected={showUsersFilter}
      change={setShowUsersFilter}
    />,
    xs && (
      <SortButton
        id={"ordenarUsuarios"}
        key={`ordenarUsuarios`}
        label={"Ordenar usuarios"}
        criterios={orderCriteria}
        cambioCriterios={setOrderCriteria}
      />
    ),
    <IconTooltip
      id={"actualizarUsuario"}
      title={"Actualizar"}
      key={`actualizarUsuario`}
      action={async () => {
        await getUsers();
      }}
      icon={<RefreshCcw />}
      name={"Actualizar lista de usuario"}
    />,
    permissions.create && (
      <OwnIconButton
        id={"agregarUsuario"}
        key={"agregarUsuario"}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        icon={<CirclePlus />}
        description={"Agregar usuario"}
        action={() => {
          addUserModal();
        }}
      />
    ),
  ];

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users`,
        params: {
          page,
          limit,
          ...(userFilter.length == 0 ? {} : { filter: userFilter }),
          ...(sortFilter(orderCriteria).length == 0
            ? {}
            : {
                orderRaw: sortFilter(orderCriteria).join(","),
              }),
        },
      });
      setUsersData(res.data?.rows);
      setTotal(res.data?.total);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener usuarios`, e);
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      setRolesData(res.data.rows);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener roles`, e);
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const changeUserState = async (usuario: UserRolCRUDType) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${usuario.id}/${
          usuario.status == "ACTIVO" ? "inactivate" : "activate"
        }`,
        type: "patch",
      });
      print(`respuesta inactivar usuario: ${res}`);
      toast.success("Éxito", { description: MessagesInterpreter(res) });
      await getUsers();
    } catch (e) {
      print(`Error al inactivar usuarios`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const restoreUserPassword = async (usuario: UserRolCRUDType) => {
    try {
      setLoading(true);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${usuario.id}/restauracion`,
        type: "patch",
      });
      print(`respuesta restablecer usuario: ${respuesta}`);
      toast.success("Éxito", { description: MessagesInterpreter(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al restablecer usuario`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (usuario: UserRolCRUDType) => {
    try {
      setLoading(true);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${usuario.id}`,
        type: "delete",
      });
      print(`eliminar cuenta de usuario: ${respuesta}`);
      toast.success("Éxito", { description: MessagesInterpreter(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al reenvio correo usuario`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const resendActivationEmail = async (usuario: UserRolCRUDType) => {
    try {
      setLoading(true);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${usuario.id}/reenviar`,
        type: "patch",
      });
      print(`respuesta reenviar correo usuario: ${respuesta}`);
      toast.success("Éxito", { description: MessagesInterpreter(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al reenvio correo usuario`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const addUserModal = () => {
    setUserEdition(null);
    setModalUser(true);
  };
  const editUserModal = (usuario: UserRolCRUDType) => {
    setUserEdition(usuario);
    setModalUser(true);
  };

  const closeUserModal = async () => {
    setModalUser(false);
    await delay(500);
    setUserEdition(null);
  };

  const editUserModalState = (usuario: UserRolCRUDType) => {
    setUserEdition(usuario);
    setShowAlertUserState(true);
  };

  const restoreUserModalPassword = (usuario: UserRolCRUDType) => {
    setUserEdition(usuario);
    setShowAlertRestoreUser(true);
  };

  const reenvioCorreoModal = (usuario: UserRolCRUDType) => {
    setUserEdition(usuario);
    setShowAlertEmailResend(true);
  };

  const cancelAlertUserState = async () => {
    setShowAlertUserState(false);
    await delay(500);
    setUserEdition(null);
  };

  const acceptAlertUserState = async () => {
    setShowAlertUserState(false);
    if (userEdition) {
      await changeUserState(userEdition);
    }
    setUserEdition(null);
  };

  const cancelAlertUserRestore = async () => {
    setShowAlertRestoreUser(false);
    await delay(500);
    setUserEdition(null);
  };

  const acceptAlertUserRestore = async () => {
    setShowAlertRestoreUser(false);
    if (userEdition) {
      await restoreUserPassword(userEdition);
    }
    setUserEdition(null);
  };

  const cancelAlertResendEmail = async () => {
    setShowAlertEmailResend(false);
    await delay(500);
    setUserEdition(null);
  };

  const acceptAlertResendEmail = async () => {
    setShowAlertEmailResend(false);
    if (userEdition) {
      await resendActivationEmail(userEdition);
    }
    setUserEdition(null);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/users");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRoles()
      .then(() => {
        getUsers()
          .catch(() => {})
          .finally(() => {});
      })
      .catch(() => {})
      .finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ,
    page,
    limit,
    userFilter,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
  ]);

  useEffect(() => {
    if (!showUsersFilter) {
      setUserFilter("");
    }
  }, [showUsersFilter]);

  return (
    <>
      <AlertDialog
        isOpen={showAlertUserState}
        title={"Alerta"}
        text={`¿Está seguro de ${
          userEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } a ${titleCase(userEdition?.names ?? "")} ?`}
      >
        <Button onClick={cancelAlertUserState}>Cancelar</Button>
        <Button onClick={acceptAlertUserState}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={showAlertRestoreUser}
        title={"Alerta"}
        text={`¿Está seguro de restablecer la contraseña de
         ${titleCase(userEdition?.names ?? "")} ?`}
      >
        <Button onClick={cancelAlertUserRestore}>Cancelar</Button>
        <Button onClick={acceptAlertUserRestore}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={showAlertEmailResend}
        title={"Alerta"}
        text={`¿Está seguro de reenviar el correo de activación de
         ${titleCase(userEdition?.names ?? "")} ?`}
      >
        <Button onClick={cancelAlertResendEmail}>Cancelar</Button>
        <Button onClick={acceptAlertResendEmail}>Aceptar</Button>
      </AlertDialog>

      <CustomDialog
        isOpen={modalUser}
        handleClose={closeUserModal}
        title={userEdition ? "Editar usuario" : "Nuevo usuario"}
      >
        <UsersModalView
          user={userEdition}
          roles={rolesData}
          correctAction={() => {
            closeUserModal().finally();
            getUsers().finally();
          }}
          cancelAction={closeUserModal}
        />
      </CustomDialog>

      <CustomDataTable
        error={!!errorData}
        loading={loading}
        title="Usuarios"
        actions={actions}
        columns={orderCriteria}
        changeOrderCriteria={setOrderCriteria}
        tableContent={contentTable}
        filters={
          showUsersFilter && (
            <UsersFilter
              availableRoles={rolesData}
              usersFilter={userFilter}
              correctAction={(filtros) => {
                setPage(1);
                setLimit(10);
                setUserFilter(filtros.user);
              }}
              closeAction={() => {}}
            />
          )
        }
        pagination={
          <Pagination
            page={page}
            limit={limit}
            total={total}
            changePage={setPage}
            changeLimit={setLimit}
          />
        }
      />
    </>
  );
}
