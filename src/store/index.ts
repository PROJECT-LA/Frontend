import { create } from 'zustand'
import { imprimir } from '../utils/imprimir'
import { ThemeMode } from '@/types/temaTypes'
import { CasbinTypes, PermisosCasbin } from '@/types/utils/casbin'

interface GlobalState {
  openDrawer: boolean
  toggleDrawer: () => void
  themeMode: ThemeMode
  cerrarDrawer: () => void
  permisos: PermisosCasbin
  setPermisos: (ruta: string, permisos: CasbinTypes) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  themeMode: 'primary-light',
  openDrawer: true,
  permisos: {
    ruta: '/',
    permisos: {
      create: false,
      read: false,
      update: false, 
      delete: false
    }
  },
  setPermisos: (ruta: string, permisos: CasbinTypes)=>{
    set((state) => {
      return {
        ...state, 
        permisos: {
          ruta: ruta, 
          permisos: permisos
        }
      }
    })
  },
  toggleDrawer: () => {
    set((state) => {
      imprimir(state.openDrawer)
      return { openDrawer: !state.openDrawer }
    })
  },
  cerrarDrawer: () => {
    set((state) => {
      return { ...state, openDrawer: false }
    })
  },
}))
