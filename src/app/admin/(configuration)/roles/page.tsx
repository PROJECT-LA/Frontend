'use client'
import { BotonBuscar } from '@/components/botones/BotonBuscar'
import { BotonOrdenar } from '@/components/botones/BotonOrdenar'
import { IconoBoton } from '@/components/botones/IconoBoton'
import { IconoTooltip } from '@/components/botones/IconoTooltip'
import { Paginacion } from '@/components/datatable/Paginacion'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { Constantes } from '@/config'
import { useSession } from '@/hooks/useSession'
import { CriterioOrdenType } from '@/types/ordenTypes'
import { RolCRUDType } from './types'
import { imprimir } from '@/utils/imprimir'
import { ordenFiltrado } from '@/utils/orden'
import { InterpreteMensajes, delay, siteName, titleCase } from '@/utils/utilidades'
import { Button, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { VistaModalRol } from './ui/ModalRol'
import { CustomDataTable } from '@/components/datatable/CustomDataTable'
import { FiltroRol } from './ui/FiltroRol'
import { useGlobalStore } from '@/store'
import { usePathname } from 'next/navigation'
import { useRoles } from '@/hooks/useRoles'
import { Edit, RefreshCcw, ToggleLeft, ToggleRight } from 'lucide-react'


const RolesPage = () => {
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

  const [rolesData, setRolesData] = useState<RolCRUDType[]>([])

  const [loading, setLoading] = useState<boolean>(true)

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

  const { sesionPeticion } = useSession()

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


  /// Criterios de orden
  const [ordenCriterios, setOrdenCriterios] = useState<
    Array<CriterioOrdenType>
  >([
    { campo: 'rol', nombre: 'Rol', ordenar: true },
    { campo: 'nombre', nombre: 'Nombre', ordenar: true },
    { campo: 'estado', nombre: 'Estado', ordenar: true },
    { campo: 'acciones', nombre: 'Acciones' },
  ])

  const contenidoTabla: Array<Array<ReactNode>> = rolesData.map(
    (rolData, indexRol) => [
      <Typography key={`${rolData.id}-${indexRol}-rol`} variant={'body2'}>
        {`${rolData.name}`}
      </Typography>,
      <Typography
        key={`${rolData.id}-${indexRol}-nombre`}
        variant={'body2'}
      >{`${rolData.name}`}</Typography>,
      <Typography key={`${rolData.id}-${indexRol}-estado`} component={'div'}>
        <CustomMensajeEstado
          titulo={rolData.status}
          descripcion={rolData.status}
          color={
            rolData.status == 'ACTIVO'
              ? 'success'
              : rolData.status == 'INACTIVO'
                ? 'error'
                : 'info'
          }
        />
      </Typography>,
      <Grid key={`${rolData.id}-${indexRol}-accion`}>
        {permisos.permisos.update && (
          <IconoTooltip
            id={`cambiarEstadoRol-${rolData.id}`}
            titulo={rolData.status == 'ACTIVO' ? 'Inactivar' : 'Activar'}
            color={rolData.status == 'ACTIVO' ? 'success' : 'error'}
            accion={() => {
              editarEstadoRolModal(rolData)
            }}
            desactivado={rolData.status == 'PENDIENTE'}
            icono={rolData.status == 'ACTIVO' ? <ToggleRight/> : <ToggleLeft/>}
            name={rolData.status == 'ACTIVO' ? 'Inactivar Rol' : 'Activar Rol'}
          />
        )}
        {permisos.permisos.update && (
          <IconoTooltip
            id={`editarRol-${rolData.id}`}
            titulo={'Editar'}
            color={'primary'}
            accion={() => {
              imprimir(`Editaremos`, rolData)
              editarRolModal(rolData)
            }}
            icono={<Edit/>}
            name={'Roles'}
          />
        )}
      </Grid>,
    ]
  )

  const acciones: Array<ReactNode> = [
    <BotonBuscar
      id={'accionFiltrarRolToggle'}
      key={'accionFiltrarRolToggle'}
      seleccionado={mostrarFiltroRol}
      cambiar={setMostrarFiltroRol}
    />,
    xs && (
      <BotonOrdenar
        id={'ordenarRoles'}
        key={`ordenarRoles`}
        label={'Ordenar roles'}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconoTooltip
      id={'actualizarRol'}
      titulo={'Actualizar'}
      key={`accionActualizarRol`}
      accion={async () => {
        await obtenerRolesPeticion()
      }}
      icono={<RefreshCcw/>}
      name={'Actualizar lista de roles'}
    />,
    permisos.permisos.create && (
      <IconoBoton
        id={'agregarRol'}
        key={'agregarRol'}
        texto={'Agregar'}
        variante={xs ? 'icono' : 'boton'}
        icono={'add_circle_outline'}
        descripcion={'Agregar rol'}
        accion={() => {
          agregarRolModal()
        }}
      />
    ),
  ]

  useEffect(() => {
    obtenerRolesPeticion().finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagina,
    limite,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    filtroRol,
  ])

  const cambiarEstadoRolPeticion = async (rol: RolCRUDType) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/roles/${rol.id}/${
          rol.status == 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        tipo: 'patch',
      })
      imprimir(`respuesta inactivar rol: ${respuesta}`)
      toast.success('Éxito', {description: InterpreteMensajes(respuesta)})
      await obtenerRolesPeticion()
    } catch (e) {
      imprimir(`Error al inactivar rol`, e)
      toast.error('Error', { description: InterpreteMensajes(e) })
    } finally {
      setLoading(false)
    }
  }

  const obtenerRolesPeticion = async () => {
    try {
      setLoading(true)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/roles`,
        params: {
          pagina: pagina,
          limite: limite,
          ...(filtroRol.length == 0 ? {} : { filtro: filtroRol }),
          ...(ordenFiltrado(ordenCriterios).length == 0
            ? {}
            : {
                orden: ordenFiltrado(ordenCriterios).join(','),
              }),
        },
      })

      imprimir(respuesta)
      setRolesData(respuesta.data?.rows)
      setTotal(respuesta.data?.total)
      setErrorRolData(null)
    } catch (e) {
      imprimir(`Error al obtener Roles`, e)
      setErrorRolData(e)
      toast.error('Error', {description: InterpreteMensajes(e)})
    } finally {
      setLoading(false)
    }
  }

  const agregarRolModal = () => {
    setRolEdicion(undefined)
    setModalRol(true)
  }
  const editarRolModal = (Rol: RolCRUDType) => {
    setRolEdicion(Rol)
    setModalRol(true)
  }

  const cerrarModalRol = async () => {
    setModalRol(false)
    await delay(500)
    setRolEdicion(undefined)
  }

  useEffect(() => {
    if (!mostrarFiltroRol) {
      setFiltroRol('')
    }
  }, [mostrarFiltroRol])

  const paginacion = (
    <Paginacion
      pagina={pagina}
      limite={limite}
      total={total}
      cambioPagina={setPagina}
      cambioLimite={setLimite}
    />
  )

  return (
    <>
      <title>{`Roles - ${siteName()}`}</title>
      <AlertDialog
        isOpen={mostrarAlertaEstadoRol}
        titulo={'Alerta'}
        texto={`¿Está seguro de ${
          rolEdicion?.status == 'ACTIVO' ? 'inactivar' : 'activar'
        } a ${titleCase(rolEdicion?.description ?? '')} ?`}
      >
        <Button onClick={cancelarAlertaEstadoRol}>Cancelar</Button>
        <Button onClick={aceptarAlertaEstadoRol}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalRol}
        handleClose={cerrarModalRol}
        title={rolEdicion ? 'Editar rol' : 'Nuevo rol'}
      >
        <VistaModalRol
          rol={rolEdicion}
          accionCorrecta={() => {
            cerrarModalRol().finally()
            obtenerRolesPeticion().finally()
          }}
          accionCancelar={cerrarModalRol}
        />
      </CustomDialog>
      <CustomDataTable
        error={!!errorRolData}
        cargando={loading}
        acciones={acciones}
        columnas={ordenCriterios}
        cambioOrdenCriterios={setOrdenCriterios}
        paginacion={paginacion}
        contenidoTabla={contenidoTabla}
        filtros={
          mostrarFiltroRol && (
            <FiltroRol
              filtroRol={filtroRol}
              accionCorrecta={(filtros) => {
                setPagina(1)
                setLimite(10)
                setFiltroRol(filtros.rol)
              }}
              accionCerrar={() => {}}
            />
          )
        }
      />
    </>
  )
}

export default RolesPage