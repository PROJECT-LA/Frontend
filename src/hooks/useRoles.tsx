import { notFound } from 'next/navigation'
import { obtenerPermisos } from '@/types/temporalTypes'
import { useGlobalStore } from '@/store'
import { useSession } from './useSession'

export const useRoles = () => {
  const { setPermisos } = useGlobalStore()
  const { sesionPeticion } = useSession()

  const obtenerPermisosPagina = async (ruta: string) => {
    const respuesta = await sesionPeticion({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/authorization/route/policies`,
      tipo: 'POST',
      body: {
        route: ruta,
      },
    })

    if (respuesta.data && respuesta.data.policie) {
      const permisos = obtenerPermisos(respuesta.data.policie)
      setPermisos(ruta, permisos)
    } else {
      notFound()
    }
  }
  return { obtenerPermisosPagina }
}
