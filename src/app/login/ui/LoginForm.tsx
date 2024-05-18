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

// Componentes y hooks
import { useAuth } from "../../../context/AuthProvider";
import { LinealLoader } from "@/components/loaders";

// Constantes y tipos
import { CONSTANTS } from "../../../../config";
import { LoginType } from "../types";
import { print } from "@/utils";

export const LoginForm = () => {
  const theme = useTheme();
  const { ingresar, progresoLogin } = useAuth();
  const { handleSubmit, control } = useForm<LoginType>();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const iniciarSesion = async ({ usuario, contrasena }: LoginType) => {
    await ingresar({ usuario, contrasena });
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      color={"primary"}
      width="fit-content"
      paddingY={5}
      paddingX={10}
      borderRadius={CONSTANTS.borderRadius}
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : `${theme.palette.background.default}`,
      }}
    >
      <Stack direction="column" alignItems="center">
        <form onSubmit={handleSubmit(iniciarSesion)}>
          <Grid item xs={12}>
            <Grid
              container
              direction={matchDownSM ? "column-reverse" : "row"}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Stack alignItems="center" justifyContent="center" spacing={1}>
                  <Typography gutterBottom variant={matchDownSM ? "h2" : "h1"}>
                    Bienvenido
                  </Typography>
                  <Typography
                    variant="caption"
                    fontSize="16px"
                    textAlign={matchDownSM ? "center" : "inherit"}
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
              id={"usuario"}
              control={control}
              name="usuario"
              label="Usuario"
              size={"medium"}
              labelVariant={"subtitle1"}
              disabled={progresoLogin}
              rules={{ required: "Este campo es requerido" }}
            />
            <Box sx={{ mt: 1, mb: 1 }}></Box>
            <FormInputText
              id={"contrasena"}
              control={control}
              name="contrasena"
              label="Contraseña"
              size={"medium"}
              labelVariant={"subtitle1"}
              type={"password"}
              disabled={progresoLogin}
              rules={{
                required: "Este campo es requerido",
                minLength: {
                  value: 3,
                  message: "Mínimo 3 caracteres",
                },
              }}
            />
            <Box sx={{ mt: 1, mb: 1 }}>
              <LinealLoader mostrar={progresoLogin} />
            </Box>
          </Stack>

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

          <Box height={20} />

          <Box width="100%" textAlign="center">
            <Link
              style={{
                textDecoration: "none",
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
  );
};
