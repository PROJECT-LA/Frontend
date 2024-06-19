"use client";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Hidden,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LightLogin from "@/assets/login/light.jpeg";
import DarkLogin from "@/assets/login/dark.jpeg";
import { print } from "@/utils";

import Box from "@mui/material/Box";
import { ThemeToggler } from "@/components/buttons";
import { LoginSlider } from "./ui/LoginSlider";
import { LoginForm } from "./ui/LoginForm";
import { useAuthStore, useGlobalStore } from "@/store";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CONSTANTS } from "../../../config";
import { Lock } from "lucide-react";
import { Logo } from "@/layout/LogoSection";
import { FormInputText } from "@/components/forms";
import { useAuth } from "@/hooks/useAuth";
import { LoginType } from "@/types/auth";
import { useForm } from "react-hook-form";
import { LinealLoader } from "@/components/loaders";

export default function LoginPage() {
  const theme = useTheme();
  const { login } = useAuth();
  const { loginLoader } = useAuthStore();
  const { handleSubmit, control } = useForm<LoginType>();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const loginSesion = async ({ username, password }: LoginType) => {
    await login({ username, password });
  };

  return (
    <Box height="96vh">
      <Card
        sx={{
          borderRadius: "1rem",
          height: "100%",
          marginX: "3rem",
          marginY: "1rem",
        }}
      >
        <Grid container borderRadius={CONSTANTS.borderRadius}>
          <Grid item xs={8} zIndex={1}>
            <Image
              src={LightLogin}
              alt="light login background"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={4} position="relative" height="100%">
            <Stack height="100%" justifyContent="space-between">
              <Stack direction="row" justifyContent="space-between">
                <Logo />
                <ThemeToggler />
              </Stack>

              <Stack>
                <Box height={30} />
                <Divider />
                <Box height={30} />
                <Typography variant="h2" color="secondary">
                  Inicia sesión
                </Typography>
                <Box height={10} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">
                    ¿No tienes una cuenta?
                  </Typography>
                  <Typography variant="subtitle2" color="secondary">
                    Contáctate con un administrador
                  </Typography>
                </Stack>
                <Box height={30} />
                <Divider />
                <Box height={30} />

                <FormInputText
                  id={"username"}
                  control={control}
                  name="username"
                  label="Usuario"
                  size={"medium"}
                  labelVariant={"subtitle1"}
                  disabled={loginLoader}
                  rules={{ required: "Este campo es requerido" }}
                />
                <Box sx={{ mt: 1, mb: 1 }}></Box>
                <FormInputText
                  id={"password"}
                  control={control}
                  name="password"
                  label="Contraseña"
                  size={"medium"}
                  labelVariant={"subtitle1"}
                  type={"password"}
                  disabled={loginLoader}
                  rules={{
                    required: "Este campo es requerido",
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 caracteres",
                    },
                  }}
                />
                <Box sx={{ mt: 1, mb: 1 }}>
                  <LinealLoader mostrar={loginLoader} />
                </Box>

                <Box width="100%">
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="left"
                  >
                    <Link
                      sx={{
                        textDecoration: "none",
                        color: theme.palette.primary.main,
                      }}
                      href="/"
                    >
                      ¿Olvidó su contraseña?
                    </Link>
                  </Stack>
                </Box>

                <Stack gap={2} width="100%" marginTop={4} alignItems="center">
                  <Grid item xs={12} sx={{ width: "100%" }}>
                    <Button
                      type="submit"
                      disableElevation
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.grey[100],
                      }}
                    >
                      Iniciar sesión
                    </Button>
                  </Grid>

                  <Divider sx={{ width: "80%" }} />
                  <Button
                    type="button"
                    disableElevation
                    size="large"
                    onClick={() => {
                      print("Login Google");
                    }}
                    fullWidth
                    variant="outlined"
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image
                        src="/images/google.svg"
                        alt="logo google"
                        width={30}
                        height={30}
                        style={{ marginRight: matchDownSM ? 8 : 16 }}
                      />
                      Ingresar con Google
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
