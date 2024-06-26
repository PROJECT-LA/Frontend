"use client";
import { UserType, LoginType } from "@/types/auth";
import { useRouter } from "next/router";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GlobalState {
  titlePage: string;
  setTitlePage: (title: string) => void;

  openDrawer: boolean;
  toggleDrawer: () => void;
  cerrarDrawer: () => void;
}
interface AuthState {
  user: UserType | undefined;
  setUserData: (userData: UserType) => void;
  deleteUserInfo: () => void;
  loginLoader: boolean;
  setLoginLoader: (changeLogin: boolean) => void;
  setUserRole: (idRol: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      setUserData: (userData: UserType) => {
        set((state) => {
          return { ...state, user: userData };
        });
      },
      deleteUserInfo: () => {
        set((state) => {
          return { ...state, user: undefined };
        });
      },
      loginLoader: false,
      setLoginLoader: (changeLogin: boolean) => {
        set((state) => {
          return { ...state, loginLoader: changeLogin };
        });
      },
      setUserRole: async (idRol: string) => {},
    }),
    {
      name: "auth-information",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useGlobalStore = create<GlobalState>((set) => ({
  titlePage: "",
  setTitlePage: (newTitle: string) => {
    set((state) => {
      return { ...state, titlePage: newTitle };
    });
  },
  openDrawer: true,
  toggleDrawer: () => {
    set((state) => {
      return { ...state, openDrawer: !state.openDrawer };
    });
  },
  cerrarDrawer: () => {
    set((state) => {
      return { ...state, openDrawer: false };
    });
  },
}));
