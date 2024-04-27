import { create } from 'zustand'
import { imprimir } from '../utils/imprimir'
import { ThemeMode } from '@/types/temaTypes'

interface GlobalState {
  openDrawer: boolean
  toggleDrawer: () => void
  themeMode: ThemeMode
  cerrarDrawer: () => void
}

// TODO: Migración de Registrador de tema para ser usado desde un store global de zustand

export const useGlobalStore = create<GlobalState>((set) => ({
  themeMode: 'primary-light',
  openDrawer: true,
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
