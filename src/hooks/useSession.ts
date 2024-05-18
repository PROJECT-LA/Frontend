import { delay } from "@/utils";
import { saveCookie, readCookie, deleteCookie, print } from "../utils";
import { Services, forbiddenStates, methodFormatRequest } from "../services";
import { checkToken } from "@/utils/token";
import { useFullScreenLoading } from "@/context/FullScreenLoading";
import { CONSTANTS } from "../../config";
import { useRouter } from "next/navigation";

export const useSession = () => {
  const router = useRouter();
  const { showFullScreen, hideFullScreen } = useFullScreenLoading();

  const sessionRequest = async ({
    url,
    type = "get",
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: methodFormatRequest) => {
    try {
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
      if (e.code === "ECONNABORTED") {
        throw new Error("La petición está tardando demasiado");
      }

      if (Services.isNetworkError(e)) {
        throw new Error("Error en la conexión 🌎");
      }

      if (forbiddenStates.includes(e.response?.status)) {
        showFullScreen();
        await logoutSession();
        hideFullScreen();
        return;
      }

      throw e.response?.data || "Ocurrió un error desconocido";
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
      print(token);

      deleteSessionCookie();

      const response = await Services.get({
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        url: `${CONSTANTS.baseUrl}/auth/logout`,
      });
      print(`finalizando con respuesta`, response);

      if (response === "OK") {
        router.push("/login");
      }
    } catch (e) {
      print(`Error al cerrar sesión: `, e);
    } finally {
      hideFullScreen();
    }
  };

  const updateSession = async () => {
    print(`Actualizando token 🚨`);

    try {
      const response = await Services.post({
        url: `${CONSTANTS.baseUrl}/token`,
        body: {
          token: readCookie("token"),
        },
      });

      saveCookie("token", response.datos?.access_token);

      await delay(500);
    } catch (e) {
      await logoutSession();
    }
  };

  return { sessionRequest, logoutSession, deleteSessionCookie };
};
