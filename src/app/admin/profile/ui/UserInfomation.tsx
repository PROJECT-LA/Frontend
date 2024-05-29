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

interface UserCUInformation {
  names: string;
  lastNames: string;
  email: string;
  phone: string;
  username: string;
  ci: string;
  roles: RolCRUDType[];
  location: string;
}

export const UserInfomation = ({
  userInfo,
  loadingModal,
  setLoadingModal,
}: {
  userInfo: UserRolCRUDType;
  loadingModal: boolean;
  setLoadingModal: (status: boolean) => void;
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
      roles: userInfo.roles,
      phone: "",
      location: "",
    },
  });

  const saveProfileInformation = async (data: UserCUInformation) => {
    try {
      setLoadingModal(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${user?.id}`,
        type: "PATCH",
        body: data,
      });
      toast.success(MessagesInterpreter(res));
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoadingModal(false);
    }
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
                name="location"
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

        <Box height={10} />
        <LinealLoader mostrar={loadingModal} />
        <Box height={10} />
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
