'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Constantes } from '@/config'
import React, { ReactNode, useEffect, useState } from 'react'
import { delay, InterpreteMensajes, siteName, titleCase } from '@/utils/utilidades'
import { imprimir } from '@/utils/imprimir'
import { RolType, UsuarioRolCRUDType } from './types'
import { useSession } from '@/hooks/useSession'
import { useAuth } from '@/context/AuthProvider'

import { Button, Chip, Grid, useMediaQuery, useTheme } from '@mui/material'
import { usePathname } from 'next/navigation'
import { CriterioOrdenType } from '@/types/ordenTypes'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { BotonBuscar } from '@/components/botones/BotonBuscar'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { ordenFiltrado } from '@/utils/orden'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { FiltroUsuarios } from './ui/FiltroUsuarios'
import { VistaModalUsuario } from './ui/ModalUsuarios'

import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { Paginacion } from '@/components/datatable/Paginacion'
import { toast } from 'sonner'
import { useRoles } from '@/hooks/useRoles'
import { useGlobalStore } from '@/store'
import { Key, KeyRound, Mail, Mails, Pencil, RefreshCcw, ToggleLeft, ToggleRight, Trash } from 'lucide-react'

export default function UsuariosPage() {
   /// Verificación adicional para los permisos
   const pathname = usePathname()
   const { obtenerPermisosPagina } = useRoles()
   const { permisos } = useGlobalStore()
   useEffect(()=>{
     obtenerPermisosPagina(pathname)
     /* eslint-disable */
   }, [])
   imprimir(permisos)
   /* Código que se debe de repetir en cada página */

  // data de usuarios
  const [usuariosData, setUsuariosData] = useState<UsuarioRolCRUDType[]>([])

  // Flag que indica que hay un proceso cargando visualmente
  const [loading, setLoading] = useState<boolean>(true)

  /// Indicador de error en una petición
  const [errorData, setErrorData] = useState<any>()

  /// Indicador para mostrar una ventana modal de usuario
  const [modalUsuario, setModalUsuario] = useState(false)

  /// Indicador para mostrar una vista de alerta de cambio de estado
  const [mostrarAlertaEstadoUsuario, setMostrarAlertaEstadoUsuario] =
    useState(false)

  /// Indicador para mostrar una vista de alerta de restablecimiento de contraseña
  const [mostrarAlertaRestablecerUsuario, setMostrarAlertaRestablecerUsuario] =
    useState(false)

  /// Indicador para mostrar una vista de alerta de reenvio de correo de activación
  const [mostrarAlertaReenvioCorreo, setMostrarAlertaReenvioCorreo] =
    useState(false)

  /// Variable que contiene el estado del usuario que se está editando
  const [usuarioEdicion, setUsuarioEdicion] = useState<
    UsuarioRolCRUDType | undefined | null
  >()

  // Roles de usuario
  const [rolesData, setRolesData] = useState<RolType[]>([])

  // Variables de paginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  // Filtros
  const [filtroUsuario, setFiltroUsuario] = useState<string>('')
  const [filtroRoles, setFiltroRoles] = useState<string[]>([])

  /// Indicador para mostrar el filtro de usuarios
  const [mostrarFiltroUsuarios, setMostrarFiltroUsuarios] = useState(false)

  // Proveedor de la sesión

  const { sesionPeticion } = useSession()


  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))


  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'names', nombre: 'Nombres', ordenar: true },
    { campo: 'lastNames', nombre: 'Apellidos', ordenar: true },
    { campo: 'email', nombre: 'Correo electrónico', ordenar: true },
    { campo: 'phone', nombre: 'Número de telefono' },
    { campo: 'roles', nombre: 'Roles' },
    { campo: 'status', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  /// Contenido del data table
  const contenidoTabla: Array<Array<ReactNode>> = usuariosData.map(
    (usuarioData, indexUsuario) => [
      <div key={`${usuarioData.id}-${indexUsuario}-nombres`}>
        <Typography variant={'body2'}>
          {`${usuarioData.names}`}
        </Typography>
      </div>,
      <div key={`${usuarioData.id}-${indexUsuario}-apellidos`}>
      <Typography variant={'body2'}>
        {`${usuarioData.lastNames}`}
      </Typography>
    </div>,
       <Typography
       key={`${usuarioData.id}-${indexUsuario}-tipoDoc`}
       variant={'body2'}
     >
       {`${usuarioData.email}`}
     </Typography>,
      <Typography
        key={`${usuarioData.id}-${indexUsuario}-usuario`}
        variant={'body2'}
      >
        {usuarioData.phone}
      </Typography>,

      
      <Grid key={`${usuarioData.id}-${indexUsuario}-roles`}>
        {usuarioData.roles.map((itemUsuarioRol, indexUsuarioRol) => (
          <Chip
            key={`usuario-rol-${indexUsuarioRol}`}
            label={itemUsuarioRol.name}
          />
        ))}
      </Grid>,
      <Typography
        component={'div'}
        key={`${usuarioData.id}-${indexUsuario}-estado`}
      >
        <CustomMensajeEstado
          titulo={usuarioData.status}
          descripcion={usuarioData.status}
          color={
            usuarioData.status == 'ACTIVO'
              ? 'success'
              : usuarioData.status == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />
      </Typography>,
      <Grid key={`${usuarioData.id}-${indexUsuario}-acciones`}>
        {permisos.permisos.update && (
          <IconoTooltip
            id={`editarEstadoUsuario-${usuarioData.id}`}
            titulo={usuarioData.status == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            color={usuarioData.status == 'ACTIVO' ? 'success' : 'error'}
            accion={async () => {
              await editarEstadoUsuarioModal(usuarioData)
            }}
            desactivado={usuarioData.status == 'PENDIENTE'}
            icono={usuarioData.status == 'ACTIVO' ? <ToggleRight/> : <ToggleLeft/>}
            name={
              usuarioData.status == 'ACTIVO'
                ? 'Inactivar Usuario'
                : 'Activar Usuario'
            }
          />
        )}
        {(usuarioData.status == 'ACTIVO' ||
          usuarioData.status == 'INACTIVO') && (
          <IconoTooltip
            id={`restablecerContrasena-${usuarioData.id}`}
            titulo= 'Restablecer contraseña'
            color={'info'}
            accion={async () => {
              await restablecimientoPassUsuarioModal(usuarioData)
            }}
            icono={<KeyRound/>}
            name={'Restablecer contraseña'}
          />
        )}
        {usuarioData.status == 'PENDIENTE' && (
          <IconoTooltip
            id={`reenviarCorreoActivacion-${usuarioData.id}`}
            titulo={'Reenviar correo de activación'}
            color={'info'}
            accion={async () => {
              await reenvioCorreoModal(usuarioData)
            }}
            icono={<Mails/>}
            name={'Reenviar correo de activación'}
          />
        )}
        {permisos.permisos.update && (
          <IconoTooltip
            id={`editarUsusario-${usuarioData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, usuarioData)
              editarUsuarioModal(usuarioData)
            }}
            icono={<Pencil/>}
            name={'Editar usuario'}
          />
        )}
        {
          permisos.permisos.delete && (
            <IconoTooltip
              id={`eliminarUsuario-${usuarioData.id}`}
              titulo={'Eliminar'}
              color={'secondary'}
              accion={()=>{
                imprimir(`Eliminaremos`, usuarioData)
                eliminarCuenta(usuarioData)
              }}
              icono={<Trash/>}
              name={'Eliminar cuenta'}
            />
          )
}
      </Grid>,
    ]
  )

  /// Acciones para data table
  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarUsuarioToggle'}
      key={'accionFiltrarUsuarioToggle'}
      seleccionado={mostrarFiltroUsuarios}
      cambiar={setMostrarFiltroUsuarios}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarUsuarios'}
        key={`ordenarUsuarios`}
        label={'Ordenar usuarios'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarUsuario'}
      titulo={'Actualizar'}
      key={`actualizarUsuario`}
      accion={async () => {
        await obtenerUsuariosPeticion()
      }}
      icono={<RefreshCcw/>}
      name={'Actualizar lista de usuario'}
    />,
    permisos.permisos.create && (
      <IconoBoton
        id={'agregarUsuario'}
        key={'agregarUsuario'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar usuario'}
        accion={() => {
          agregarUsuarioModal()
        }}
      />
    ),
  ]

  /// Petición que obtiene lista de usuarios
  const obtenerUsuariosPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/users`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroUsuario.length == 0 ? {} : { filtro: filtroUsuario }),
          ...(filtroRoles.length == 0 ? {} : { rol: filtroRoles.join(',') }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })
      setUsuariosData(respuesta.data?.rows)
      setTotal(respuesta.data?.total)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener usuarios`, e)
      setErrorData(e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  /// Petición que obtiene lista de roles
  const obtenerRolesPeticion = async () => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/roles`,
      })
      setRolesData(respuesta.data.rows)
      setErrorData(null)
    } catch (e) {
      imprimir(`Error al obtener roles`, e)
      setErrorData(e)
      toast.error('Error', {description: InterpreteMensajes(e)})
      throw e
    } finally {
      setLoading(false)
    }
  }

  /// Petición que cambia el estado de un usuario
  const cambiarEstadoUsuarioPeticion = async (usuario: UsuarioRolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/users/${usuario.id}/${
          usuario.status == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta inactivar usuario: ${respuesta}`)
      toast.success('Éxito', {description: InterpreteMensajes(respuesta)})
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al inactivar usuarios`, e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  /// Petición que restablecer la contraseña del usuario
  const restablecerPassUsuarioPeticion = async (usuario: UsuarioRolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/users/${usuario.id}/restauracion`,
        tipo: 'patch',
      })
      imprimir(`respuesta restablecer usuario: ${respuesta}`)
      toast.success('Éxito', {description: InterpreteMensajes(respuesta)})
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al restablecer usuario`, e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  /// Petición que elimina cuenta de usuario
  const eliminarCuenta = async (usuario: UsuarioRolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/users/${usuario.id}`,
        tipo: 'delete',
      })
      imprimir(`eliminar cuenta de usuario: ${respuesta}`)
      toast.success('Éxito', {description: InterpreteMensajes(respuesta)})
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al reenvio correo usuario`, e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  /// Petición que reenvia correo de activación
  const reenviarCorreoActivacionPeticion = async (usuario: UsuarioRolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/users/${usuario.id}/reenviar`,
        tipo: 'patch',
      })
      imprimir(`respuesta reenviar correo usuario: ${respuesta}`)
      toast.success('Éxito', {description: InterpreteMensajes(respuesta)})
      await obtenerUsuariosPeticion()
    } catch (e) {
      imprimir(`Error al reenvio correo usuario`, e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  /// Método abre una ventana modal para un usuario nuevo

  const agregarUsuarioModal = () => {
    setUsuarioEdicion(null)
    setModalUsuario(true)
  }
  /// Método abre una ventana modal para un usuario existente
  const editarUsuarioModal = (usuario: UsuarioRolCRUDType) => {
    setUsuarioEdicion(usuario)
    setModalUsuario(true)
  }

  /// Método que cierra una ventana modal
  const cerrarModalUsuario = async () => {
    setModalUsuario(false)
    await delay(500)
    setUsuarioEdicion(null)
  }

  /// Método que muestra alerta de cambio de estado

  const editarEstadoUsuarioModal = (usuario: UsuarioRolCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaEstadoUsuario(true) // para mostrar alerta de usuarios
  }

  /// Método que muestra alerta de restablecimiento de contraseña

  const restablecimientoPassUsuarioModal = (usuario: UsuarioRolCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaRestablecerUsuario(true) // para mostrar alerta de usuarios
  }

  /// Método que muestra alerta de reenvio de correo

  const reenvioCorreoModal = (usuario: UsuarioRolCRUDType) => {
    setUsuarioEdicion(usuario) // para mostrar datos de usuario en la alerta
    setMostrarAlertaReenvioCorreo(true) // para mostrar alerta de usuarios
  }

  /// Método que cierra alerta de cambio de estado

  const cancelarAlertaEstadoUsuario = async () => {
    setMostrarAlertaEstadoUsuario(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }

  /// Método que oculta la alerta y procede al cambio
  const aceptarAlertaEstadoUsuario = async () => {
    setMostrarAlertaEstadoUsuario(false)
    if (usuarioEdicion) {
      await cambiarEstadoUsuarioPeticion(usuarioEdicion)
    }
    setUsuarioEdicion(null)
  }

  /// Método que cierra alerta de cambio de estado

  const cancelarAlertaRestablecerUsuario = async () => {
    setMostrarAlertaRestablecerUsuario(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }

  /// Método que oculta la alerta y procede al cambio
  const aceptarAlertaRestablecerUsuario = async () => {
    setMostrarAlertaRestablecerUsuario(false)
    if (usuarioEdicion) {
      await restablecerPassUsuarioPeticion(usuarioEdicion)
    }
    setUsuarioEdicion(null)
  }

  /// Método que cierra alerta de reenvio de correo

  const cancelarAlertaReenvioCorreo = async () => {
    setMostrarAlertaReenvioCorreo(false)
    await delay(500) // para no mostrar undefined mientras el modal se cierra
    setUsuarioEdicion(null)
  }

  /// Método que oculta la alerta de reenvio de correo y procede a llamar la petición
  const aceptarAlertaReenvioCorreo = async () => {
    setMostrarAlertaReenvioCorreo(false)
    if (usuarioEdicion) {
      await reenviarCorreoActivacionPeticion(usuarioEdicion)
    }
    setUsuarioEdicion(null)
  }



  useEffect(() => {
    obtenerRolesPeticion()
      .then(() => {
        obtenerUsuariosPeticion()
          .catch(() => {})
          .finally(() => {})
      })
      .catch(() => {})
      .finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filtroRoles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroUsuario,
  ])

  useEffect(() => {
    if (!mostrarFiltroUsuarios) {
      setFiltroUsuario('')
      setFiltroRoles([])
    }
  }, [mostrarFiltroUsuarios])

  return (
    <>
      <title>{`Usuarios - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoUsuario}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          usuarioEdicion?.status == 'ACTIVO' ? 'inactivar' : 'activar'
        } a ${titleCase(usuarioEdicion?.names ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoUsuario}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoUsuario}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={mostrarAlertaRestablecerUsuario}
        titulo={'Alerta'}
        texto={`¿Está seguro de restablecer la contraseña de
         ${titleCase(usuarioEdicion?.names ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaRestablecerUsuario}>Cancelar</Button>
        <Button onClick={aceptarAlertaRestablecerUsuario}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={mostrarAlertaReenvioCorreo}
        titulo={'Alerta'}
        texto={`¿Está seguro de reenviar el correo de activación de
         ${titleCase(usuarioEdicion?.names ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaReenvioCorreo}>Cancelar</Button>
        <Button onClick={aceptarAlertaReenvioCorreo}>Aceptar</Button>
      </AlertDialog>

      <CustomDialog
        isOpen={modalUsuario}
        handleClose={cerrarModalUsuario}
        title={usuarioEdicion ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <VistaModalUsuario
          usuario={usuarioEdicion}
          roles={rolesData}
          accionCorrecta={() => {
            cerrarModalUsuario().finally()
            obtenerUsuariosPeticion().finally()
          }}
          accionCancelar={cerrarModalUsuario}
        />
      </CustomDialog>
      <CustomDataTable
        error={!!errorData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroUsuarios && (
            <FiltroUsuarios
              rolesDisponibles={rolesData}
              filtroRoles={filtroRoles}
              filtroUsuario={filtroUsuario}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroRoles(filtros.roles)
                setFiltroUsuario(filtros.usuario)
              }}
              accionCerrar={() => {}}
            />
          )
        }
        paginacion={
          <Paginacion
            pagina={pagina}
            limite={limite}
            total={total}
            cambioPagina={setPagina}
            cambioLimite={setLimite}
          />
        }
      />
    </>
  )
}
