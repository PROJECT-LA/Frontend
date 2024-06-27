"use client";
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider";
import { useAuthStore } from "@/store";
import { MessagesInterpreter, delay, print } from "@/utils";
import { useSession } from "./useSession";
import { useRouter } from "next/navigation";
import { LoginType } from "@/types/auth";
import { Services } from "@/services";
import { CONSTANTS } from "../../config";
import { toast } from "sonner";

export const useAuth = () => {
  const { deleteUserInfo, setUserData, setLoginLoader } = useAuthStore();
  const router = useRouter();
  const { showFullScreen, hideFullScreen } = useFullScreenLoading();
  const { sessionRequest, logoutSession } = useSession();

  const deleteUserSession = () => {
    deleteUserInfo();
  };

  const changeRole = async (idRole: string) => {
    print(`Cambiando rol 👮‍♂️: ${idRole}`);
    const res = await sessionRequest({
      type: "patch",
      url: `${CONSTANTS.baseUrl}/auth/change-rol`,
      body: {
        idRole,
      },
    });
    if (res.status === 401) {
      await logoutSession();
    }

    print(`Token nuevo Rol ✅: ${res.data.token}`);

    setUserData(res.data);
    router.push("/admin/home");
  };

  const login = async ({ username, password }: LoginType) => {
    try {
      setLoginLoader(true);
      await delay(1000);

      const res = await Services.post({
        url: `${CONSTANTS.baseUrl}/auth/login`,
        body: { username, password },
      });
      print(res.data.token);

      setUserData(res.data);
      print(`Usuarios ✅`, res.data);

      showFullScreen();
      await delay(1000);
      router.push("/admin/home");

      await delay(1000);
    } catch (e) {
      print(`Error al iniciar sesión: `, e);
      toast.error(MessagesInterpreter(e));
      deleteUserInfo();
    } finally {
      setLoginLoader(false);
      hideFullScreen();
    }
  };
  return { login, deleteUserSession, changeRole };
};
