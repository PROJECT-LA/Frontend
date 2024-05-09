'use client'
// Librerías
import Box from '@mui/material/Box'
import { Grid, Hidden, useTheme } from '@mui/material'

// Componentes y hooks
import { BotonCambioTema } from '@/components/botones'
import { LoginSlider } from './ui/LoginSlider'
import { LoginForm } from './ui/LoginForm'

export default function LoginPage() {
  const theme = useTheme()

  return (
    <Grid
      container
      justifyContent="space-evenly"
      sx={{ position: 'relative', minHeight: '100vh' }}
      alignItems={'center'}
    >
      <Grid
        item
        lg={7}
        md={12}
        xs={12}
        bgcolor={
          theme.palette.mode === 'light'
            ? theme.palette.background.default
            : theme.palette.background.paper
        }
        alignContent="center"
        width="100%"
        minHeight="100vh"
        height="100%"
      >
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <BotonCambioTema />
        </Box>

        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoginForm />
        </Box>
      </Grid>

      <Hidden lgDown={true}>
        <LoginSlider />
      </Hidden>
    </Grid>
  )
}
