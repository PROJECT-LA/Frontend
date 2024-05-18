import { create } from "zustand";
import { print } from "@/utils";
import { ThemeMode } from "@/theme/types";

interface GlobalState {
  openDrawer: boolean;
  toggleDrawer: () => void;
  themeMode: ThemeMode;
  cerrarDrawer: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  themeMode: "primary-light",
  openDrawer: true,
  permisos: {
    ruta: "/",
    permisos: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  },
  toggleDrawer: () => {
    set((state) => {
      return { openDrawer: !state.openDrawer };
    });
  },
  cerrarDrawer: () => {
    set((state) => {
      return { ...state, openDrawer: false };
    });
  },
}));
