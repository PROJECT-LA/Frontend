import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'

import {
  Box,
  Button,
  ButtonBase,
  Card,
  Chip,
  ClickAwayListener,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Popper,
  Radio,
  Stack,
  Typography,
} from '@mui/material'
import Transitions from '@/components/Transitions'

import { LogOut, CircleUser, Users } from 'lucide-react'
import { Constantes } from '@/config'
import { imprimir } from '@/utils/imprimir'
import { useAuth } from '@/context/AuthProvider'
import { RoleType } from '@/types/login'
import { Icono } from '@/components/Icono'
import { delay } from '@/utils/utilidades'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { useSession } from '@/hooks/useSession'

const ProfileSection = () => {
  const router = useRouter()
  const [roles, setRoles] = useState<RoleType[]>([])
  const { usuario, setRolUsuario, rolUsuario } = useAuth()
  const { cerrarSesion } = useSession()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const interpretarRoles = () => {
    imprimir(`Cambio en roles 📜`, usuario?.roles)
    if (usuario?.roles && usuario?.roles.length > 0) {
      setRoles(usuario?.roles)
    }
  }

  const cambiarRol = async (event: React.ChangeEvent<HTMLInputElement>) => {
    imprimir(`Valor al hacer el cambio: ${event.target.value}`)
    cerrarMenuPerfil()
    mostrarFullScreen(`Cambiando de rol..`)
    await delay(1000)
    router.push('/admin/home')
    await setRolUsuario({ idRol: `${event.target.value}` })
    ocultarFullScreen()
  }

  /// Interpretando roles desde estado
  useEffect(() => {
    interpretarRoles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const [mostrarAlertaCerrarSesion, setMostrarAlertaCerrarSesion] =
    useState(false)

  const anchorRef = useRef<HTMLDivElement | null>(null)

  const handleClose = (event: unknown) => {
    // @ts-expect-error Error en el tipo de evento
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }
    setOpen(false)
  }

  const accionMostrarAlertaCerrarSesion = () => {
    cerrarMenuPerfil()
    setMostrarAlertaCerrarSesion(true)
  }

  const cerrarMenuSesion = async () => {
    cerrarMenuPerfil()
    await cerrarSesion()
  }

  const cerrarMenuPerfil = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaCerrarSesion}
        titulo={'Alerta'}
        texto={`¿Está seguro de cerrar sesión?`}
      >
        <Button
          onClick={() => {
            setMostrarAlertaCerrarSesion(false)
          }}
        >
          Cancelar
        </Button>
        <Button
          sx={{ fontWeight: 'medium' }}
          onClick={async () => {
            setMostrarAlertaCerrarSesion(false)
            await cerrarMenuSesion()
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.divider,
          border: 1,

          '& .MuiChip-label': {
            lineHeight: 0,
          },
        }}
        icon={<CircleUser color={theme.palette.text.primary} />}
        label={
          <Stack direction="row" alignItems="center" gap={1}>
            <Stack>
              <Typography variant="h5" color={theme.palette.text.primary}>
                Alexander
              </Typography>
            </Stack>
          </Stack>
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={cerrarMenuPerfil}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleClose}>
              <Card
                sx={{
                  boxShadow: Constantes.boxShadow,
                  borderRadius: Constantes.borderRadius,
                }}
              >
                <Box sx={{ p: 3 }}>
                  <ButtonBase
                    onClick={() => {
                      imprimir('Ver perfil')
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={5}
                      alignItems="center"
                    >
                      <ButtonBase>
                        <CircleUser color={theme.palette.text.primary} />
                      </ButtonBase>
                      <Stack alignItems="center">
                        <Typography
                          component="span"
                          variant="h4"
                          sx={{ fontWeight: 400 }}
                        >
                          Alexander Nina
                        </Typography>
                        <Typography>Administrador</Typography>
                      </Stack>
                    </Stack>
                  </ButtonBase>

                  <Stack spacing={1} marginY={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Users />
                      <Typography>Roles</Typography>
                    </Stack>

                    {/* Roles */}
                    {roles.length > 1 && (
                      <Box>
                        <MenuItem
                          sx={{
                            p: 2,
                            ml: 0,
                            '&.MuiButtonBase-root:hover': {
                              bgcolor: 'transparent',
                            },
                          }}
                        >
                          <Icono>switch_account</Icono>
                          <Box width={'20px'} />
                          <Typography variant={'body2'}>Roles </Typography>
                        </MenuItem>
                        <List key={`roles`} sx={{ p: 0 }}>
                          {roles.map((rol, indexRol) => (
                            <ListItem key={`rol-${indexRol}`}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  borderRadius: 1,
                                  alignItems: 'center',
                                }}
                              >
                                <Box width={'20px'} />
                                <FormControlLabel
                                  value={rol.idRol}
                                  control={
                                    <Radio
                                      checked={rolUsuario?.idRol === rol.idRol}
                                      onChange={cambiarRol}
                                      color={'success'}
                                      size="small"
                                      value={rol.idRol}
                                      name="radio-buttons"
                                    />
                                  }
                                  componentsProps={{
                                    typography: { variant: 'body2' },
                                  }}
                                  label={rol.nombre}
                                />
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogOut />}
                    onClick={accionMostrarAlertaCerrarSesion}
                  >
                    Cerrar sesión
                  </Button>
                </Box>
              </Card>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </>
  )
}

export default ProfileSection
