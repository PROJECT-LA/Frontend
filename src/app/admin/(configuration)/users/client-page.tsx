"use client";
import Typography from "@mui/material/Typography";
import { CONSTANTS } from "../../../../../config";
import React, { ReactNode, useEffect, useState } from "react";
import { delay, InterpreteMensajes, print, titleCase } from "@/utils";
import { RolType, UserRolCRUDType } from "./types";
import { useSession } from "@/hooks/useSession";
import { Button, Chip, Grid, useMediaQuery, useTheme } from "@mui/material";
import { ordenFiltrado, CriterioOrdenType } from "@/types";
import CustomMensajeEstado from "@/components/estados/CustomMensajeEstado";
import { IconoTooltip } from "@/components/buttons/IconoTooltip";
import { SortButton, SearchButton } from "@/components/buttons";
import { IconoBoton } from "@/components/buttons/IconoBoton";
import { AlertDialog } from "@/components/modales/AlertDialog";
import { CustomDialog } from "@/components/modales/CustomDialog";
import { FiltroUsuarios } from "./ui/FiltroUsuarios";
import { VistaModalUsuario } from "./ui/ModalUsuarios";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { Paginacion } from "@/components/datatable/Paginacion";
import { toast } from "sonner";
import {
  KeyRound,
  Mails,
  Pencil,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  Trash,
} from "lucide-react";
import { GlobalPermissionsProps, PermissionTypes } from "@/utils/permissions";

export default function UsersClientPage({
  permissions,
}: GlobalPermissionsProps) {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [rolesData, setRolesData] = useState<RolType[]>([]);
  const [usersData, setUsersData] = useState<UserRolCRUDType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [filtroUsuario, setFiltroUsuario] = useState<string>("");
  const [filtroRoles, setFiltroRoles] = useState<string[]>([]);

  const [modalUser, setModalUser] = useState(false);
  const [showAlertUserState, setShowAlertUserState] = useState(false);
  const [showAlertRestoreUser, setShowAlertRestoreUser] = useState(false);
  const [showAlertEmailResend, setShowAlertEmailResend] = useState(false);

  const [userEdition, setUserEdition] = useState<
    UserRolCRUDType | undefined | null
  >();

  const [showUsersFilter, setShowUsersFilter] = useState(false);

  const { sessionRequest } = useSession();

  const [orderCriteria, setOrderCriteria] = useState<Array<CriterioOrdenType>>([
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
        <CustomMensajeEstado
          titulo={userData.status}
          descripcion={userData.status}
          color={
            userData.status == "ACTIVO"
              ? "success"
              : userData.status == "INACTIVO"
              ? "error"
              : "info"
          }
        />
      </Typography>,
      <Grid key={`${userData.id}-${indexUsuario}-acciones`}>
        {permissions.update && (
          <IconoTooltip
            id={`editarEstadoUsuario-${userData.id}`}
            titulo={userData.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={userData.status == "ACTIVO" ? "success" : "error"}
            accion={async () => {
              await editUserModalState(userData);
            }}
            desactivado={userData.status == "PENDIENTE"}
            icono={
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
          <IconoTooltip
            id={`restablecerContrasena-${userData.id}`}
            titulo="Restablecer contraseña"
            color={"info"}
            accion={async () => {
              await restoreUserModalPassword(userData);
            }}
            icono={<KeyRound />}
            name={"Restablecer contraseña"}
          />
        )}
        {userData.status == "PENDIENTE" && (
          <IconoTooltip
            id={`reenviarCorreoActivacion-${userData.id}`}
            titulo={"Reenviar correo de activación"}
            color={"info"}
            accion={async () => {
              await reenvioCorreoModal(userData);
            }}
            icono={<Mails />}
            name={"Reenviar correo de activación"}
          />
        )}
        {permissions.update && (
          <IconoTooltip
            id={`editarUsusario-${userData.id}`}
            titulo={"Editar"}
            color={"primary"}
            accion={() => {
              print(`Editaremos`, userData);
              editUserModal(userData);
            }}
            icono={<Pencil />}
            name={"Editar usuario"}
          />
        )}
        {permissions.delete && (
          <IconoTooltip
            id={`eliminarUsuario-${userData.id}`}
            titulo={"Eliminar"}
            color={"secondary"}
            accion={() => {
              print(`Eliminaremos`, userData);
              deleteAccount(userData);
            }}
            icono={<Trash />}
            name={"Eliminar cuenta"}
          />
        )}
      </Grid>,
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
    <IconoTooltip
      id={"actualizarUsuario"}
      titulo={"Actualizar"}
      key={`actualizarUsuario`}
      accion={async () => {
        await getUsers();
      }}
      icono={<RefreshCcw />}
      name={"Actualizar lista de usuario"}
    />,
    permissions.create && (
      <IconoBoton
        id={"agregarUsuario"}
        key={"agregarUsuario"}
        texto={"Agregar"}
        variante={xs ? "icono" : "boton"}
        icono={"add_circle_outline"}
        descripcion={"Agregar usuario"}
        accion={() => {
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
          pagina: page,
          limite: limit,
          ...(filtroUsuario.length == 0 ? {} : { filtro: filtroUsuario }),
          ...(filtroRoles.length == 0 ? {} : { rol: filtroRoles.join(",") }),
          ...(ordenFiltrado(orderCriteria).length == 0
            ? {}
            : {
                orden: ordenFiltrado(orderCriteria).join(","),
              }),
        },
      });
      setUsersData(res.data?.rows);
      setTotal(res.data?.total);
      setErrorData(null);
    } catch (e) {
      print(`Error al obtener usuarios`, e);
      setErrorData(e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
      toast.error("Error", { description: InterpreteMensajes(e) });
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
          usuario.status == "ACTIVO" ? "inactivacion" : "activacion"
        }`,
        type: "patch",
      });
      print(`respuesta inactivar usuario: ${res}`);
      toast.success("Éxito", { description: InterpreteMensajes(res) });
      await getUsers();
    } catch (e) {
      print(`Error al inactivar usuarios`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al restablecer usuario`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al reenvio correo usuario`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });
      await getUsers();
    } catch (e) {
      print(`Error al reenvio correo usuario`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
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
    page,
    limit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filtroRoles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(orderCriteria),
    filtroUsuario,
  ]);

  useEffect(() => {
    if (!showUsersFilter) {
      setFiltroUsuario("");
      setFiltroRoles([]);
    }
  }, [showUsersFilter]);

  return (
    <>
      <AlertDialog
        isOpen={showAlertUserState}
        titulo={"Alerta"}
        texto={`¿Está seguro de ${
          userEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } a ${titleCase(userEdition?.names ?? "")} ?`}
      >
        <Button onClick={cancelAlertUserState}>Cancelar</Button>
        <Button onClick={acceptAlertUserState}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={showAlertRestoreUser}
        titulo={"Alerta"}
        texto={`¿Está seguro de restablecer la contraseña de
         ${titleCase(userEdition?.names ?? "")} ?`}
      >
        <Button onClick={cancelAlertUserRestore}>Cancelar</Button>
        <Button onClick={acceptAlertUserRestore}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={showAlertEmailResend}
        titulo={"Alerta"}
        texto={`¿Está seguro de reenviar el correo de activación de
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
        <VistaModalUsuario
          usuario={userEdition}
          roles={rolesData}
          accionCorrecta={() => {
            closeUserModal().finally();
            getUsers().finally();
          }}
          accionCancelar={closeUserModal}
        />
      </CustomDialog>

      <CustomDataTable
        error={!!errorData}
        cargando={loading}
        titulo="Usuarios"
        acciones={actions}
        columnas={orderCriteria}
        cambioOrdenCriterios={setOrderCriteria}
        contenidoTabla={contentTable}
        filtros={
          showUsersFilter && (
            <FiltroUsuarios
              rolesDisponibles={rolesData}
              filtroRoles={filtroRoles}
              filtroUsuario={filtroUsuario}
              accionCorrecta={(filtros) => {
                setPage(1);
                setLimit(10);
                setFiltroRoles(filtros.roles);
                setFiltroUsuario(filtros.usuario);
              }}
              accionCerrar={() => {}}
            />
          )
        }
        paginacion={
          <Paginacion
            pagina={page}
            limite={limit}
            total={total}
            cambioPagina={setPage}
            cambioLimite={setLimit}
          />
        }
      />
    </>
  );
}
