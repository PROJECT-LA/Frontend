'use client'

import { useAuth } from '@/context/AuthProvider'
import { useSession } from '@/hooks/useSession'
import { RolCRUDType } from '@/types/roles'
import { RUTAS, RutasType, obtenerPermisos } from '@/types/temporalTypes'
import { CasbinTypes } from '@/types/utils/casbin'
import { imprimir } from '@/utils/imprimir'
import { delay, siteName } from '@/utils/utilidades'
import { useMediaQuery, useTheme } from '@mui/material'
import { notFound, usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'

const obtenerRutasPermisos = (ruta: string, rol: any): CasbinTypes => {
  /// Fetch api que devuelva los permisos dado un rol de la ruta que se está enviando Ver SolicitarPermisos interface
  const existe: RutasType | undefined = RUTAS.find((elem) => elem.ruta === ruta)

  if (existe === undefined) notFound()
  const permisos = obtenerPermisos(existe.permisos)
  return permisos
}

const RolesPage = () => {
  const pathname = usePathname()
  const { rolUsuario } = useAuth()
  imprimir('--------------------------------')
  imprimir(rolUsuario && rolUsuario.rol)
  imprimir('--------------------------------')
  const rolUsuarioNombre = rolUsuario?.rol

  const permisos: CasbinTypes = obtenerRutasPermisos(pathname, rolUsuarioNombre)

  const [rolesData, setRolesData] = useState<RolCRUDType[]>([])

  const [errorRolData, setErrorRolData] = useState<any>()

  const [modalRol, setModalRol] = useState(false)

  const [rolEdicion, setRolEdicion] = useState<RolCRUDType | undefined>()

  // Variables de páginado
  const [limite, setLimite] = useState<number>(10)
  const [pagina, setPagina] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  //filtros

  const [filtroRol, setFiltroRol] = useState<string>('')
  const [mostrarFiltroRol, setMostrarFiltroRol] = useState(false)

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const [mostrarAlertaEstadoRol, setMostrarAlertaEstadoRol] = useState(false)

  const editarEstadoRolModal = (rol: RolCRUDType) => {
    setRolEdicion(rol) // para mostrar datos de Rol en la alerta
    setMostrarAlertaEstadoRol(true) // para mostrar alerta de Roles
  }

  const cancelarAlertaEstadoRol = async () => {
    setMostrarAlertaEstadoRol(false)
    await delay(500)
    setRolEdicion(undefined)
  }

  const aceptarAlertaEstadoRol = async () => {
    setMostrarAlertaEstadoRol(false)
    if (rolEdicion) {
      await cambiarEstadoRolPeticion(rolEdicion)
    }
    setRolEdicion(undefined)
  }

  const contenidoTabla: Array<Array<ReactNode>> = rolesData.map(
    (rolData, indexRol) => [
      <Typography key={`${rolData.id}-${indexRol}-rol`} variant={'body2'}>
        {`${rolData.rol}`}
      </Typography>,
      <Typography
        key={`${rolData.id}-${indexRol}-nombre`}
        variant={'body2'}
      >{`${rolData.nombre}`}</Typography>,
      <Typography key={`${rolData.id}-${indexRol}-estado`} component={'div'}>
        <CustomMensajeEstado
          titulo={rolData.estado}
          descripcion={rolData.estado}
          color={
            rolData.estado == 'ACTIVO'
              ? 'success'
              : rolData.estado == 'INACTIVO'
              ? 'error'
              : 'info'
          }
        />
      </Typography>,
      <Grid key={`${rolData.id}-${indexRol}-accion`}>
        {permisos.update && (
          <IconoTooltip
            id={`cambiarEstadoRol-${rolData.id}`}
            titulo={rolData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            color={rolData.estado == 'ACTIVO' ? 'success' : 'error'}
            accion={() => {
              editarEstadoRolModal(rolData)
            }}
            desactivado={rolData.estado == 'PENDIENTE'}
            icono={rolData.estado == 'ACTIVO' ? 'toggle_on' : 'toggle_off'}
            name={rolData.estado == 'ACTIVO' ? 'Inactivar Rol' : 'Activar Rol'}
          />
        )}
        {permisos.update && (
          <IconoTooltip
            id={`editarRol-${rolData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, rolData)
              editarRolModal(rolData)
            }}
            icono={'edit'}
            name={'Roles'}
          />
        )}
      </Grid>,
    ]
  )

  const cambiarEstadoRolPeticion = async (rol: RolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/roles/${rol.id}/${
          rol.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta inactivar rol: ${respuesta}`)
      toast.success(InterpreteMensajes(respuesta))
      await obtenerRolesPeticion()
    } catch (e) {
      imprimir(`Error al inactivar rol`, e)
      toast.error(InterpreteMensajes(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <title>{`Roles - ${siteName()}`}</title>
    </>
  )
}

export default RolesPage
