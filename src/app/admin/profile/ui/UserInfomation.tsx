import { useSession } from "@/hooks/useSession";
import { useAuthStore } from "@/store";
import React from "react";
import { useForm } from "react-hook-form";
import { UserRolCRUDType } from "../../(configuration)/users/types";
import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { CONSTANTS } from "../../../../../config";
import { Save } from "lucide-react";
import { FormInputText } from "@/components/forms";

interface UserCUInformation {
  names: string;
  lastNames: string;
  email: string;
  username: string;
  ci: string;
  phone: string;
  address: string;
}

export const UserInfomation = ({
  userInfo,
  loadingModal,
}: {
  userInfo: UserRolCRUDType;
  loadingModal: boolean;
}) => {
  const theme = useTheme();
  const { sessionRequest } = useSession();
  const { user } = useAuthStore();
  const { handleSubmit, control } = useForm<UserCUInformation>({
    defaultValues: {
      username: userInfo.username,
      email: userInfo.email,
      lastNames: userInfo.lastNames,
      names: userInfo.names,
      ci: "",
      phone: "",
      address: "",
    },
  });

  return (
    <Stack spacing={CONSTANTS.gridSpacing}>
      <Box>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"names"}
              control={control}
              type="text"
              name="names"
              label="Nombres"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"lastNames"}
              control={control}
              type="text"
              name="lastNames"
              label="Apellidos"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"ci"}
              control={control}
              type="text"
              name="ci"
              label="Nro. Documento"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"phone"}
              control={control}
              type="text"
              name="phone"
              label="Telefono/Celular"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormInputText
              id={"address"}
              control={control}
              type="text"
              name="address"
              label="Dirección"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"username"}
              control={control}
              type="text"
              name="username"
              label="Usuario"
              disabled={loadingModal}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormInputText
              id={"email"}
              control={control}
              type="emailr"
              name="email"
              label="Correo electrónico"
              disabled={loadingModal}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Button
          disabled={loadingModal}
          variant="contained"
          startIcon={<Save />}
        >
          Actualizar perfil
        </Button>
      </Box>
    </Stack>
  );
};
