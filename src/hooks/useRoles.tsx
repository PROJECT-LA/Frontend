import { notFound } from "next/navigation";
import { RUTAS, RutasType, obtenerPermisos } from "@/types/temporalTypes";
import { useGlobalStore } from "@/store";


export const useRoles = () => {
// TODO: lógica para obtener el rol del usuario actual

const { setPermisos } = useGlobalStore()

const obtenerPermisosPagina = async (ruta: string) =>{
/// Fetch api que devuelva los permisos dado un rol de la ruta que se está enviando Ver SolicitarPermisos interface
const existe: RutasType | undefined = RUTAS.find((elem) => elem.ruta === ruta)
if (existe === undefined) notFound()
const permisos = await obtenerPermisos(existe.permisos)

if(permisos)
    setPermisos(ruta, permisos)

}
return {obtenerPermisosPagina}
}
