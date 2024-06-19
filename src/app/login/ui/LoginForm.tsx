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
        <Box height={30} />
        <Divider />
        <Box height={30} />
        <Typography variant="h1" color="primary">
          Inicia sesión
        </Typography>
        <Box height={5} />
        <Stack direction="row" spacing={1}>
          <Typography variant="h5" fontWeight="300">
            ¿Sin cuenta?
          </Typography>
          <Typography variant="h5" fontWeight="400" color="secondary">
            Contacta con un administrador
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

        <Stack gap={4} width="100%" marginTop={4} alignItems="center">
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
            <Box display="flex" justifyContent="center" alignItems="center">
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
    </form>
  );
};
