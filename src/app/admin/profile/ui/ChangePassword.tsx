import MainCard from "@/components/cards/MainCard";
import {
  Button,
  Grid,
  Stack,
  Typography,
  Box,
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { CONSTANTS } from "../../../../../config";
import { FormInputText } from "@/components/forms";
import { useForm } from "react-hook-form";
import { Dot, Lock } from "lucide-react";
import { LinealLoader } from "@/components/loaders";
import { useSession } from "@/hooks/useSession";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { MessagesInterpreter, delay } from "@/utils";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export const ChangePassword = () => {
  const { user } = useAuthStore();
  const { sessionRequest } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const { handleSubmit, control } = useForm<ChangePasswordForm>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordRequest = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("La nueva contraseña y la de confirmación son diferentes.");
      return;
    }
    try {
      setLoading(true);
      await delay(500);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users/${user?.id}/change-password`,
        type: "PATCH",
        body: {
          password: data.oldPassword,
          newPassword: data.newPassword,
        },
      });
      toast.success(MessagesInterpreter(res));
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={CONSTANTS.gridSpacing}>
      <Typography variant="h4">Cambiar contraseña</Typography>
      <MainCard>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit(changePasswordRequest)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormInputText
                    id={"names"}
                    control={control}
                    type="password"
                    name="oldPassword"
                    label="Contraseña anterior"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    id={"names"}
                    control={control}
                    type="password"
                    name="newPassword"
                    label="Nueva contraseña"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInputText
                    id={"names"}
                    control={control}
                    type="password"
                    name="confirmPassword"
                    label="Confirme la contraseña"
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              <LinealLoader mostrar={loading} />
              <Box height={20} />
              <Button type="submit" variant="contained" startIcon={<Lock />}>
                Cambiar contraseña
              </Button>
            </form>
          </Grid>
          <Hidden mdDown={true}>
            <Grid item md={6}>
              <Alert>Asegurate que tu contraseña tenga</Alert>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Dot />
                  </ListItemIcon>
                  <ListItemText>Mínimo debe tener 5 caracteres</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Dot />
                  </ListItemIcon>
                  <ListItemText>Al menos una mayúscula</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Dot />
                  </ListItemIcon>
                  <ListItemText>Al menos una minúscula</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Dot />
                  </ListItemIcon>
                  <ListItemText>Al menos un caracter especial</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Dot />
                  </ListItemIcon>
                  <ListItemText>Al menos un número</ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Hidden>
        </Grid>
      </MainCard>
    </Stack>
  );
};
