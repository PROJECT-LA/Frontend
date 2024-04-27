// Librerías
import {
  Box,
  Stack,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Link,
  Button,
  Divider,
} from '@mui/material'
import { useForm } from 'react-hook-form'

import { FormInputText } from '@/components/forms'

// Assets
import CiudadaniaLogo from '../../../assets/images/ciudadania_logo.svg'

// Componentes y hooks
import { useAuth } from '../../../context/AuthProvider'
import { ProgresoLineal } from '@/components/progreso'

import { AnimateButton } from '@/components/botones'

// Constantes y tipos
import { Constantes } from '../../../config'
import { LoginType } from '@/types/login'
import { imprimir } from '../../../utils/imprimir'

export const LoginForm = () => {
  const theme = useTheme()
  const { ingresar, progresoLogin } = useAuth()
  const { handleSubmit, control } = useForm<LoginType>({
    defaultValues: {
      usuario: 'ADMINISTRADOR-TECNICO',
      contrasena: '123',
    },
  })
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

  const iniciarSesion = async ({ usuario, contrasena }: LoginType) => {
    await ingresar({ usuario, contrasena })
  }

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      color={'primary'}
      width="fit-content"
      paddingY={5}
      paddingX={10}
      borderRadius={Constantes.borderRadius}
      sx={{
        backgroundColor: `${theme.palette.background.default}`,
      }}
    >
      <Stack direction="column" alignItems="center">
        <form onSubmit={handleSubmit(iniciarSesion)}>
          <Grid item xs={12}>
            <Grid
              container
              direction={matchDownSM ? 'column-reverse' : 'row'}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Stack alignItems="center" justifyContent="center" spacing={1}>
                  <Typography gutterBottom variant={matchDownSM ? 'h5' : 'h1'}>
                    Bienvenido
                  </Typography>
                  <Typography
                    variant="caption"
                    fontSize="16px"
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                  >
                    Introduce tu usuario y contraseña para ingresar
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          <Box height={35} />

          <Stack width="100%">
            <FormInputText
              id={'usuario'}
              control={control}
              name="usuario"
              label="Usuario"
              size={'medium'}
              labelVariant={'subtitle1'}
              disabled={progresoLogin}
              rules={{ required: 'Este campo es requerido' }}
            />
            <Box sx={{ mt: 1, mb: 1 }}></Box>
            <FormInputText
              id={'contrasena'}
              control={control}
              name="contrasena"
              label="Contraseña"
              size={'medium'}
              labelVariant={'subtitle1'}
              type={'password'}
              disabled={progresoLogin}
              rules={{
                required: 'Este campo es requerido',
                minLength: {
                  value: 3,
                  message: 'Mínimo 3 caracteres',
                },
              }}
            />
            <Box sx={{ mt: 1, mb: 1 }}>
              <ProgresoLineal mostrar={progresoLogin} />
            </Box>
          </Stack>

          <Box width="100%">
            <Stack direction="row" alignItems="center" justifyContent="left">
              <Link
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                }}
                href="/"
              >
                ¿Olvidó su contraseña?
              </Link>
            </Stack>
          </Box>

          <Stack gap={2} width="100%" marginTop={4} alignItems="center">
            <Grid item xs={12} sx={{ width: '100%' }}>
              <AnimateButton>
                <Button
                  type="button"
                  disableElevation
                  fullWidth
                  onClick={() => {
                    imprimir('Login Ciudadanía')
                  }}
                  size="large"
                  variant="contained"
                  sx={{
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.grey[100],
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    sx={{ mr: { xs: 1, sm: 2, width: 20 } }}
                  >
                    <img
                      src={CiudadaniaLogo}
                      alt="logo ciudadanía"
                      width={30}
                      height={30}
                      style={{ marginRight: matchDownSM ? 8 : 16 }}
                    />
                  </Box>
                  <Typography
                    fontWeight="600"
                    color={theme.palette.primary.light}
                  >
                    Ingresar con Ciudadanía
                  </Typography>
                </Button>
              </AnimateButton>
            </Grid>

            <Divider sx={{ width: '80%' }} />
            <Button
              type="submit"
              disableElevation
              size="large"
              fullWidth
              variant="outlined"
            >
              Iniciar sesión
            </Button>
          </Stack>

          <Box height={20} />

          <Box width="100%" textAlign="center">
            <Link
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
              }}
              href="/"
            >
              ¿No tienes una cuenta?
            </Link>
          </Box>
        </form>
      </Stack>
    </Box>
  )
}
