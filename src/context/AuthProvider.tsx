'use client'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useFullScreenLoading } from './FullScreenLoadingProvider'
import { Constantes } from '../config'
import { imprimir } from '../utils/imprimir'
import { Enforcer } from 'casbin'
import { useRouter } from 'next/navigation'
import { leerCookie, guardarCookie } from '../utils/cookies'
import { delay, InterpreteMensajes } from '../utils/utilidades'
import { CasbinTypes } from '../types/utils/casbin'
import { idRolType, LoginType, RoleType, UsuarioType } from '@/types/login'

import { Servicios } from '../services'

import { useSession } from '../hooks/useSession'
import { useCasbinEnforcer } from '@/hooks/useCasbinEnforcer'

import { toast } from 'sonner'

interface ContextProps {
  cargarUsuarioManual: () => Promise<void>
  inicializarUsuario: () => Promise<void>
  estaAutenticado: boolean
  usuario: UsuarioType | null
  rolUsuario: RoleType | undefined
  setRolUsuario: ({ idRol }: idRolType) => Promise<void>
  ingresar: ({ usuario, contrasena }: LoginType) => Promise<void>
  progresoLogin: boolean
  permisoUsuario: (routerName: string) => Promise<CasbinTypes>
  permisoAccion: (objeto: string, accion: string) => Promise<boolean>
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UsuarioType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const router = useRouter()

  const { sesionPeticion, borrarCookiesSesion } = useSession()
  const { inicializarCasbin, interpretarPermiso, permisoSobreAccion } =
    useCasbinEnforcer()
  const [enforcer, setEnforcer] = useState<Enforcer>()

  const inicializarUsuario = async () => {
    const token = leerCookie('token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      mostrarFullScreen()
      await obtenerUsuarioRol()
      await obtenerPermisos()

      await delay(1000)
    } catch (error: Error | any) {
      imprimir(`Error durante inicializarUsuario 🚨`, typeof error, error)
      borrarSesionUsuario()
      router.push('/login')
      throw error
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const borrarSesionUsuario = () => {
    setUser(null)
    borrarCookiesSesion()
  }

  const cargarUsuarioManual = async () => {
    try {
      await obtenerUsuarioRol()
      await obtenerPermisos()

      mostrarFullScreen()
      await delay(1000)

      router.push('/admin/home')
    } catch (error: Error | any) {
      imprimir(`Error durante cargarUsuarioManual 🚨`, error)
      borrarSesionUsuario()

      imprimir(`🚨 -> login`)
      router.push('/login')
      throw error
    } finally {
      ocultarFullScreen()
    }
  }

  const login = async ({ usuario, contrasena }: LoginType) => {
    try {
      setLoading(true)
      console.log(`${Constantes.baseUrl}/auth/login`)

      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/auth/login`,
        body: { username: usuario, password: contrasena },
        headers: {},
      })

      imprimir(respuesta.token)
      const cookie = guardarCookie('token', respuesta.token)
      imprimir(`Token ✅: ${cookie}`)

      imprimir(leerCookie('token'))

      setUser(respuesta.datos)
      imprimir(`Usuarios ✅`, respuesta.datos)

      await obtenerPermisos()

      mostrarFullScreen()
      await delay(1000)
      router.push('/admin/home')
      await delay(1000)
    } catch (e) {
      imprimir(`Error al iniciar sesión: `, e)
      toast.error(Constantes.error, {
        description: `${InterpreteMensajes(e)}`,
      })
      borrarSesionUsuario()
    } finally {
      setLoading(false)
      ocultarFullScreen()
    }
  }

  const CambiarRol = async ({ idRol }: idRolType) => {
    imprimir(`Cambiando rol 👮‍♂️: ${idRol}`)
    await actualizarRol({ idRol })
    await obtenerPermisos()
    router.push('/admin/admin')
  }

  const actualizarRol = async ({ idRol }: idRolType) => {
    const respuestaUsuario = await sesionPeticion({
      tipo: 'patch',
      url: `${Constantes.baseUrl}/cambiarRol`,
      body: {
        idRol,
      },
    })

    guardarCookie('token', respuestaUsuario.datos?.access_token)
    imprimir(`Token ✅: ${respuestaUsuario.datos?.access_token}`)

    setUser(respuestaUsuario.datos)
    imprimir(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRol}`
    )
  }

  const obtenerPermisos = async () => {
    const respuestaPermisos = await sesionPeticion({
      url: `${Constantes.baseUrl}/autorizacion/permisos`,
    })

    setEnforcer(await inicializarCasbin(respuestaPermisos.datos))
  }

  const obtenerUsuarioRol = async () => {
    const respuestaUsuario = await sesionPeticion({
      url: `${Constantes.baseUrl}/usuarios/cuenta/perfil`,
    })

    setUser(respuestaUsuario.datos)
    imprimir(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRol}`
    )
  }

  const rolUsuario = () => user?.roles.find((rol) => rol.idRol == user?.idRol)

  return (
    <AuthContext.Provider
      value={{
        cargarUsuarioManual,
        inicializarUsuario,
        estaAutenticado: !!user && !loading,
        usuario: user,
        rolUsuario: rolUsuario(),
        setRolUsuario: CambiarRol,
        ingresar: login,
        progresoLogin: loading,
        permisoUsuario: (routerName: string) =>
          interpretarPermiso({ routerName, enforcer, rol: rolUsuario()?.rol }),
        permisoAccion: (objeto: string, accion: string) =>
          permisoSobreAccion({
            objeto,
            enforcer,
            rol: rolUsuario()?.rol ?? '',
            accion,
          }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
