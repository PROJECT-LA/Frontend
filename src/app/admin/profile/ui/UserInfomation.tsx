import { useSession } from "@/hooks/useSession";
import { useAuthStore } from "@/store";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RolCRUDType,
  UserRolCRUDType,
} from "../../(configuration)/users/types";
import {
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CONSTANTS } from "../../../../../config";
import { Save } from "lucide-react";
import { FormInputText } from "@/components/forms";
import { MessagesInterpreter, delay } from "@/utils";
import { toast } from "sonner";
import { LinealLoader } from "@/components/loaders";
import { UserCUInformation, UserProfileInfo } from "../types";

export const UserInfomation = ({
  userInfo,
  loadingModal,
  submitData,
}: {
  userInfo: UserProfileInfo;
  loadingModal: boolean;
  submitData: (data: UserCUInformation) => void;
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
      ci: userInfo.ci,
      phone: userInfo.phone,
      address: userInfo.address,
    },
  });

  const saveProfileInformation = async (data: UserCUInformation) => {
    submitData(data);
  };

  return (
    <Stack spacing={CONSTANTS.gridSpacing}>
      <form onSubmit={handleSubmit(saveProfileInformation)}>
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
                type="number"
                name="phone"
                label="Telefono/Celular"
                disabled={loadingModal}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+591</InputAdornment>
                  ),
                }}
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
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"email"}
                control={control}
                type="email"
                name="email"
                label="Correo electrónico"
                disabled={loadingModal}
              />
            </Grid>
          </Grid>
        </Box>

        <Box height={10} />
        <LinealLoader mostrar={loadingModal} />
        <Box height={20} />
        <Box>
          <Button
            type="submit"
            disabled={loadingModal}
            variant="contained"
            startIcon={<Save />}
          >
            Actualizar perfil
          </Button>
        </Box>
      </form>
    </Stack>
  );
};
