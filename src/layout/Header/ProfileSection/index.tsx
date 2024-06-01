import { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
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
} from "@mui/material";
import Transitions from "@/components/Transitions";
import { LogOut, CircleUser, Users } from "lucide-react";
import { CONSTANTS } from "../../../../config";
import { delay, print } from "@/utils";
import { useAuthStore } from "@/store";
import { RoleType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider";
import { AlertDialog } from "@/components/modals/AlertDialog";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";

const ProfileSection = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleType[]>([]);
  const { user } = useAuthStore();
  const { changeRole } = useAuth();
  const { logoutSession } = useSession();
  const { showFullScreen, hideFullScreen } = useFullScreenLoading();

  const interpretarRoles = () => {
    print(`Cambio en roles 📜`, user?.roles);
    if (user?.roles && user?.roles.length > 0) {
      setRoles(user?.roles);
    }
  };

  const cambiarRol = async (event: React.ChangeEvent<HTMLInputElement>) => {
    print(`Valor al hacer el cambio: ${event.target.value}`);
    cerrarMenuPerfil();
    showFullScreen(`Cambiando de rol..`);
    await delay(1000);
    router.push("/admin/home");
    await changeRole(`${event.target.value}`);
    hideFullScreen();
  };

  useEffect(() => {
    console.log("*************************");
    print(user);
    console.log("*************************");

    interpretarRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, user]);

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [mostrarAlertaCerrarSesion, setMostrarAlertaCerrarSesion] =
    useState(false);

  const anchorRef = useRef<HTMLDivElement | null>(null);

  const handleClose = (event: unknown) => {
    // @ts-expect-error Error en el tipo de evento
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const accionMostrarAlertaCerrarSesion = () => {
    cerrarMenuPerfil();
    setMostrarAlertaCerrarSesion(true);
  };

  const cerrarMenuSesion = async () => {
    cerrarMenuPerfil();
    await logoutSession();
  };

  const cerrarMenuPerfil = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <AlertDialog
        isOpen={mostrarAlertaCerrarSesion}
        title={"Alerta"}
        text={`¿Está seguro de cerrar sesión?`}
      >
        <Button
          onClick={() => {
            setMostrarAlertaCerrarSesion(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          sx={{ fontWeight: "medium" }}
          onClick={async () => {
            setMostrarAlertaCerrarSesion(false);
            await cerrarMenuSesion();
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <div ref={anchorRef}>
        <Button
          sx={{
            paddingBottom: 1,
            paddingTop: 1,
            transition: "all .3s ease",
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.paper
                : "transparent",
          }}
          onClick={cerrarMenuPerfil}
          startIcon={
            <>
              {user?.userData.image && user.userData.image.length > 0 ? (
                <Box
                  border={1}
                  width="25px"
                  height="25px"
                  borderColor={theme.palette.divider}
                  borderRadius="50%"
                  position="relative"
                >
                  <img
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "23px",
                      borderRadius: "50%",
                      height: "23px",
                      border: 1,
                      borderColor: theme.palette.divider,
                    }}
                    src={`data:image/jpeg;base64,${user.userData.image}`}
                  />
                </Box>
              ) : (
                <CircleUser color={theme.palette.text.primary} />
              )}
            </>
          }
          variant="outlined"
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Stack>
              <Typography variant="h5" color={theme.palette.text.primary}>
                {user?.userData.username}
              </Typography>
            </Stack>
          </Stack>
        </Button>
      </div>
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
              name: "offset",
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
                  boxShadow: CONSTANTS.boxShadow,
                  border: 1,
                  borderColor: theme.palette.grey[400],
                }}
              >
                <Box sx={{ p: 3 }}>
                  <ButtonBase
                    sx={{ width: "100%" }}
                    onClick={() => {
                      print("Ver perfil");
                    }}
                  >
                    <Stack
                      width="100%"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography
                        component="span"
                        variant="h4"
                        sx={{ fontWeight: 400 }}
                      >
                        {user?.userData.names}
                      </Typography>
                      <Typography variant="h6">{user?.roleName}</Typography>
                    </Stack>
                  </ButtonBase>

                  <Stack spacing={1} marginY={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Users size={18} />
                      <Typography variant="h5">Roles</Typography>
                    </Stack>

                    {/* Roles */}
                    {roles.length > 1 && (
                      <Box>
                        <List key={`roles`} sx={{ p: 0 }}>
                          {roles.map((rol, indexRol) => (
                            <ListItem key={`rol-${indexRol}`}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  borderRadius: 1,
                                  alignItems: "center",
                                }}
                              >
                                <FormControlLabel
                                  value={rol.id}
                                  control={
                                    <Radio
                                      checked={user?.idRole === rol.id}
                                      onChange={cambiarRol}
                                      color={"success"}
                                      size="small"
                                      value={rol.id}
                                      name="radio-buttons"
                                    />
                                  }
                                  componentsProps={{
                                    typography: { variant: "h5" },
                                  }}
                                  label={rol.name}
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
                    startIcon={<LogOut size={15} />}
                    onClick={accionMostrarAlertaCerrarSesion}
                  >
                    <Typography variant="h5">Cerrar sesión</Typography>
                  </Button>
                </Box>
              </Card>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
