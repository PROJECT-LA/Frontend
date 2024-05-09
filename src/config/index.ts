import { ThemeMode } from '../types/temaTypes'

export interface Tema {
  nombreTema: ThemeMode
  colorReferencia: string
}

const temas: Tema[] = [
  {
    nombreTema: 'primary-light',
    colorReferencia: '#2196f3',
  },
  {
    nombreTema: 'secondary-light',
    colorReferencia: '#5455a9',
  },
  {
    nombreTema: 'tertiary-light',
    colorReferencia: '#81c784',
  },
]

export const Constantes = {
  // Variables de entorno
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? '',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? '',
  sitePath: process.env.NEXT_PUBLIC_PATH ?? '',
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? '',

  // Variables de espacio
  gridSpacing: 3,
  drawerWidth: 265,
  appDrawerWidth: 320,

  // Variables del tema
  borderRadius: 4,
  letra: '"Montserrat", sans-serif',
  temas,
  boxShadow: '0 9px 17.5px rgb(0,0,0,0.05)',

  // Mensajes desde la base de datos
  error: '¡Error!',
  exito: '¡Éxito!',
  errorServidor: 'Algo salió mal desde el servidor',
  espera: 'Por favor espere...',
}
