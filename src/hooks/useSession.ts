import { MessagesInterpreter, delay, saveCookie } from "@/utils";
import { readCookie, deleteCookie, print } from "../utils";
import { Services, forbiddenStates, methodFormatRequest } from "../services";
import { checkToken } from "@/utils/token";
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider";
import { CONSTANTS } from "../../config";
import { useRouter } from "next/navigation";
import { PermissionTypes, getPermissionsBoolean } from "@/utils/permissions";

export const useSession = () => {
  const router = useRouter();
  const { showFullScreen, hideFullScreen } = useFullScreenLoading();

  const sessionRequest = async ({
    url,
    type = "get",
    isPermissions = false,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: methodFormatRequest) => {
    try {
      if (!readCookie("token")) await logoutSession();

      if (!checkToken(readCookie("token") ?? "")) {
        print(`Token caducado ⏳`);
        await updateSession();
      }

      const cabeceras = {
        accept: "application/json",
        Authorization: `Bearer ${readCookie("token") ?? ""}`,
        ...headers,
      };

      print(`enviando 🔐🌍`, body, type, url, cabeceras);
      const response = await Services.httpRequest({
        url,
        type,
        headers: cabeceras,
        body,
        params,
        responseType,
        withCredentials,
      });

      print("respuesta 🔐📡", body, type, url, response);
      return response.data;
    } catch (e: import("axios").AxiosError | any) {
      print(`${e.response.status}`);

      if (e.code === "ECONNABORTED") {
        throw new Error("La petición está tardando demasiado");
      }

      if (Services.isNetworkError(e)) {
        throw new Error("Error en la conexión 🌎");
      }

      if (isPermissions) {
        if (e.response?.status === 403) {
          router.push("/not-found");
        }
        if (e.response?.status === 404) {
          router.push("/not-found");
        }
      }

      throw e.response?.data || "Ocurrió un error desconocido";
    }
  };

  const getPermissions = async (
    route: string
  ): Promise<PermissionTypes | undefined> => {
    try {
      await delay(500);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies/authorization`,
        type: "POST",
        isPermissions: true,
        body: {
          route,
        },
      });

      const resPolicies: PermissionTypes = getPermissionsBoolean(
        res.data.policie
      );

      return resPolicies;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSessionCookie = () => {
    deleteCookie("token");
  };

  const logoutSession = async () => {
    try {
      showFullScreen();
      await delay(1000);
      const token = readCookie("token");
      if (!token) {
        router.refresh();
        router.push("/login");
      }

      deleteCookie("token");
      const response = await Services.post({
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: `${CONSTANTS.baseUrl}/auth/logout`,
      });

      print(`logout with response: `, response);
      router.push("/login");
    } catch (e) {
      print(`Error al cerrar sesión: `, e);
      deleteCookie("token");
      router.refresh();
      router.push("/login");
    } finally {
      hideFullScreen();
    }
  };

  const updateSession = async () => {
    print(`Actualizando token 🚨`);
    try {
      const res = await Services.post({
        url: `${CONSTANTS.baseUrl}/auth/refresh`,
      });

      print(res.data.token);
      saveCookie("token", res.data.token);

      if (res.status !== 201) {
        await logoutSession();
      }

      await delay(500);
    } catch (e) {
      print(MessagesInterpreter(e));
    }
  };

  return { sessionRequest, logoutSession, deleteSessionCookie, getPermissions };
};
