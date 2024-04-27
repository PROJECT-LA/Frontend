import { createTheme } from '@mui/material'
import { paleta } from '../global/palette'

import { colores } from './colores'

import { customizacion } from '../global/customization'
import { typography } from '../global/typography'

// Obtención de paleta, estilos y letras para modo claro
const paletaClaro = paleta('light', colores)
const estiloComponentesClaro = customizacion('light', colores)
const letrasClaro = typography('light', colores)

// Obtención de paleta, estilos y letras para modo oscuro
const paletaOscuro = paleta('dark', colores)
const estiloComponentesOscuro = customizacion('dark', colores)
const letrasOscuro = typography('dark', colores)

export const temaClaro = createTheme({
  palette: paletaClaro,
  components: estiloComponentesClaro,
  typography: letrasClaro,
})

export const temaOscuro = createTheme({
  palette: paletaOscuro,
  components: estiloComponentesOscuro,
  typography: letrasOscuro,
})
