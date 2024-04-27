import type { Metadata } from 'next'

import { Toaster } from 'sonner'
import './globals.css'

// Configuración del tema
import { StyledEngineProvider } from '@mui/material'
import ThemeRegistry from '@/theme/RegistroTema'
import { FullScreenLoadingProvider } from '@/context/FullScreenLoadingProvider'
import { AuthProvider } from '@/context/AuthProvider'

export const metadata: Metadata = {
  title: 'Sistema auditorías',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <StyledEngineProvider injectFirst>
          <ThemeRegistry>
            <FullScreenLoadingProvider>
              <AuthProvider>{children}</AuthProvider>
            </FullScreenLoadingProvider>
          </ThemeRegistry>
        </StyledEngineProvider>
        <Toaster richColors closeButton expand />
      </body>
    </html>
  )
}
