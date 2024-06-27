"use client";
import Image from "next/image";
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
  Hidden,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { FormInputText } from "@/components/forms";
import { useAuth } from "@/hooks/useAuth";
import { LinealLoader } from "@/components/loaders";

// Constantes y tipos
import { LoginType } from "@/types/auth";
import { print } from "@/utils";
import { useAuthStore } from "@/store";
import { Logo } from "@/layout/LogoSection";
import { ThemeToggler } from "@/components/buttons";

export const LoginForm = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const { loginLoader } = useAuthStore();
  const { handleSubmit, control } = useForm<LoginType>();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const loginSesion = async ({ username, password }: LoginType) => {
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit(loginSesion)}>
      <Stack direction="row" justifyContent="space-between">
        <Logo />
        <ThemeToggler />
      </Stack>

      <Stack>
        <Box height={mdUp ? 25 : 10} />
        <Divider />
        <Box height={mdUp ? 25 : 10} />
        <Typography variant={xlUp ? "h1" : "h2"} color="primary">
          Inicia sesión
        </Typography>
        <Box height={5} />
        <Stack direction={"row"} spacing={1}>
          <Typography variant={xlUp ? "h5" : "h6"} fontWeight="300">
            ¿Sin cuenta?
          </Typography>
          <Typography
            variant={xlUp ? "h5" : "h6"}
            fontWeight="400"
            color="secondary"
          >
            Contacta con un administrador
          </Typography>
        </Stack>

        <Box height={20} />
        <Divider />
        <Box height={20} />

        <Hidden xlDown={true}>
          <Box height={70} />
        </Hidden>

        <FormInputText
          id={"username"}
          control={control}
          name="username"
          label="Usuario"
          labelVariant={"subtitle1"}
          disabled={loginLoader}
          rules={{ required: "Este campo es requerido" }}
        />
        <Box height={20} />
        <FormInputText
          id={"password"}
          control={control}
          name="password"
          label="Contraseña"
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
          <Stack direction="row" alignItems="center" justifyContent="left">
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

        <Stack width="100%" marginTop={xlUp ? 5 : 3} alignItems="center">
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
          <Box height={xlUp ? 20 : 15} />
          <Divider sx={{ width: "80%" }} />
          <Box height={xlUp ? 20 : 15} />
          <Button
            type="button"
            disableElevation
            size="large"
            onClick={() => {
              print("Login Google");
            }}
            fullWidth
            sx={{
              backgroundColor: "#F9F9F9",
            }}
            variant="outlined"
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image
                src="/images/google.svg"
                alt="logo google"
                width={20}
                height={20}
                style={{ marginRight: matchDownSM ? 8 : 16 }}
              />
              Ingresar con Google
            </Box>
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
