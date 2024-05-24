"use client";
import MainCard from "@/components/cards/MainCard";
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PlusIcon, UserCircle2 } from "lucide-react";
import React from "react";
import { CONSTANTS } from "../../../../config";
import { useAuthStore } from "@/store";
import { GlobalPermissionsProps } from "@/utils/permissions";

const ProfileClient = ({ permissions }: GlobalPermissionsProps) => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack spacing={CONSTANTS.gridSpacing}>
      <Typography variant="h4">Perfil</Typography>
      <MainCard>
        <Grid container>
          <Grid item xs={12} md={5}>
            <MainCard>
              <Stack
                spacing={2}
                marginY={`${matchDownMd ? "1rem" : "5rem"}`}
                justifyContent="center"
                alignItems="center"
              >
                <UserCircle2 size="4rem" />
                <Typography>Alexander Humberto Nina Pacajes</Typography>
              </Stack>
            </MainCard>
          </Grid>

          <Grid item xs={1} />

          <Grid item xs={12} md={5} marginTop={`${matchDownMd && "2rem"}`}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography>Usuario</Typography>
                <Typography>@{user?.userData.names}</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography>Correo</Typography>
                <Typography>CI {user?.userData.email}</Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography>Fecha de Nacimiento</Typography>
                <Typography>28/05/1967</Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography>Roles</Typography>
                <Stack direction="row" spacing={1}>
                  {user?.roles.map((rol) => (
                    <Chip
                      key={`rol-perfil-${rol.id}-${rol.name}`}
                      label={rol.name}
                    />
                  ))}
                </Stack>
              </Stack>

              <Box>
                <Button variant="contained" startIcon={<PlusIcon />}>
                  Cambiar contraseña
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Stack>
  );
};

export default ProfileClient;
