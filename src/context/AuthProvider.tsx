"use client";
import { createContext, ReactNode, useContext, useState} from "react"
import { useFullScreenLoading } from "./FullScreenLoading";
import { useRouter } from 'next/navigation'
import { CONSTANTS } from "../../config";
import { readCookie, saveCookie, print } from "../utils";
import { delay, InterpreteMensajes } from "../utils";
import { idRolType, LoginType, RoleType, UsuarioType } from "@/app/login/types";
import { Services } from "@/services";

import { useSession } from '../hooks/useSession'

import { toast } from 'sonner'
import axios from 'axios'

interface ContextProps {
  loadManualUser: () => Promise<void>
  startUser: () => Promise<void>
  isAutentified: boolean
  user: UsuarioType | null
  userRol: RoleType | undefined
  setUserRol: ({ idRol }: idRolType) => Promise<void>
  login: ({ usuario, contrasena }: LoginType) => Promise<void>
  isLoginLoader: boolean
  actionPermission: (objeto: string, accion: string) => Promise<boolean>
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthContextType) => {
  const [user, setUser] = useState<UsuarioType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { showFullScreen, hideFullScreen } = useFullScreenLoading()

  const router = useRouter()

  const { sessionRequest, deleteSessionCookie } = useSession()

  const inicializarUsuario = async () => {
    const token = readCookie('token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      showFullScreen()
      await obtenerUsuarioRol()
      await obtenerPermisos()

      await delay(1000)
    } catch (error: Error | any) {
      print(`Error durante inicializarUsuario 🚨`, typeof error, error)
      borrarSesionUsuario()
      router.push('/login')
      throw error
    } finally {
      setLoading(false)
      hideFullScreen()
    }
  }

  const borrarSesionUsuario = () => {
    setUser(null)
    deleteSessionCookie()
  }

  const cargarUsuarioManual = async () => {
    try {
      await obtenerUsuarioRol()
      await obtenerPermisos()

      showFullScreen()
      await delay(1000)

      router.push('/admin/home')
    } catch (error: Error | any) {
      print(`Error durante cargarUsuarioManual 🚨`, error)
      borrarSesionUsuario()

      print(`🚨 -> login`)
      router.push('/login')
      throw error
    } finally {
      hideFullScreen()
    }
  }

  const login = async ({ usuario, contrasena }: LoginType) => {
    try {
      setLoading(true)
      await delay(1000)

      const respuesta = await Services.post({
        url: `${CONSTANTS.baseUrl}/auth/login`,
        body: { username: usuario, password: contrasena },
        headers: {},
      })

      print(respuesta.data.token)
      saveCookie('token', respuesta.data.token)

      setUser(respuesta.data)
      print(`Usuarios ✅`, respuesta.data)

      // await obtenerPermisos()

      showFullScreen()
      await delay(1000)
      router.push('/admin/home')

      await delay(1000)
    } catch (e) {
      print(`Error al iniciar sesión: `, e)
      toast.error('ERROR', {
        description: `${InterpreteMensajes(e)}`,
      })
      borrarSesionUsuario()
    } finally {
      setLoading(false)
      hideFullScreen()
    }
  }

  const CambiarRol = async ({ idRol }: idRolType) => {
    print(`Cambiando rol 👮‍♂️: ${idRol}`)
    await actualizarRol(Number(idRol))
    //await obtenerPermisos()
    router.push('/admin/home')
  }

  const actualizarRol = async (idRol: number) => {
    const respuestaUsuario = await sessionRequest({
      type: 'patch',
      url: `${CONSTANTS.baseUrl}/auth/change-rol`,
      body: {
        idRole: idRol + '',
      },
    })

    saveCookie('token', respuestaUsuario.datos.token)
    print(`Token ✅: ${respuestaUsuario.datos.token}`)

    setUser(respuestaUsuario.datos)
    print(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRole}`
    )
  }

  const obtenerPermisos = async () => {
    const respuestaPermisos = await sessionRequest({
      url: `${CONSTANTS.baseUrl}/autorizacion/permisos`,
    })

    // setEnforcer(await inicializarCasbin(respuestaPermisos.datos))
  }

  const obtenerUsuarioRol = async () => {
    const respuestaUsuario = await sessionRequest({
      url: `${CONSTANTS.baseUrl}/usuarios/cuenta/perfil`,
    })

    setUser(respuestaUsuario.datos)
    print(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRol}`
    )
  }

  const rolUsuario = () => user?.roles.find((rol) => rol.id == user?.idRole)

  return (
    <AuthContext.Provider
      value={{
        loadManualUser,
        startUser,
        isAutentified: !!user && !loading,
        user: user,
        userRol: rolUsuario(),
        setUserRol: CambiarRol,
        login,
        isLoginLoader: loading,
        // permisoUsuario: (routerName: string) =>
        //   interpretarPermiso({ routerName, enforcer, rol: rolUsuario()?.rol }),
        // permisoAccion: (objeto: string, accion: string) =>
        //   permisoSobreAccion({
        //     objeto,
        //     enforcer,
        //     rol: rolUsuario()?.rol ?? '',
        //     accion,
        //   }),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

      setLoading(true);
      await delay(1000);

      const respuesta = await Servicios.post({
        url: `${CONSTANTS.baseUrl}/auth/login`,
        body: { username: usuario, password: contrasena },
        headers: {},
      });

      print(respuesta.data.token);
      guardarCookie("token", respuesta.data.token);

      setUser(respuesta.data);
      print(`Usuarios ✅`, respuesta.data);

      // await obtenerPermisos()

      mostrarFullScreen();
      await delay(1000);
      router.push("/admin/home");

      await delay(1000);
    } catch (e) {
      print(`Error al iniciar sesión: `, e);
      toast.error(CONSTANTS.error, {
        description: `${InterpreteMensajes(e)}`,
      });
      borrarSesionUsuario();
    } finally {
      setLoading(false);
      ocultarFullScreen();
    }
  };

  const CambiarRol = async ({ idRol }: idRolType) => {
    print(`Cambiando rol 👮‍♂️: ${idRol}`);
    await actualizarRol(Number(idRol));
    //await obtenerPermisos()
    router.push("/admin/home");
  };

  const actualizarRol = async (idRol: number) => {
    const respuestaUsuario = await sessionRequest({
      tipo: "patch",
      url: `${CONSTANTS.baseUrl}/auth/change-rol`,
      body: {
        idRole: idRol + "",
      },
    });

    guardarCookie("token", respuestaUsuario.datos.token);
    print(`Token ✅: ${respuestaUsuario.datos.token}`);

    setUser(respuestaUsuario.datos);
    print(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRole}`
    );
  };

  const obtenerPermisos = async () => {
    const respuestaPermisos = await sessionRequest({
      url: `${CONSTANTS.baseUrl}/autorizacion/permisos`,
    });

    setEnforcer(await inicializarCasbin(respuestaPermisos.datos));
  };

  const obtenerUsuarioRol = async () => {
    const respuestaUsuario = await sessionRequest({
      url: `${CONSTANTS.baseUrl}/usuarios/cuenta/perfil`,
    });

    setUser(respuestaUsuario.datos);
    print(
      `rol definido en obtenerUsuarioRol 👨‍💻: ${respuestaUsuario.datos.idRol}`
    );
  };

  const rolUsuario = () => user?.roles.find((rol) => rol.id == user?.idRole);

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
            rol: rolUsuario()?.rol ?? "",
            accion,
          }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
