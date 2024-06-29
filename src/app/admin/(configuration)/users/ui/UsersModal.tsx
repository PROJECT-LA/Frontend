/// Vista modal de user
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CRUserType, RolType, UserRolCRUDType } from "../types";
import { useSession } from "@/hooks/useSession";
import { delay, MessagesInterpreter, print } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { FormInputDropdownMultiple } from "@/components/forms/FormDropdownMultiple";
import { FormInputText } from "@/components/forms";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { LinealLoader } from "@/components/loaders";
import { toast } from "sonner";

export interface ModalUserType {
  user?: UserRolCRUDType | undefined | null;
  roles: RolType[];
  correctAction: () => void;
  cancelAction: () => void;
}

export const UsersModalView = ({
  user,
  roles,
  correctAction,
  cancelAction,
}: ModalUserType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();

  const { handleSubmit, control } = useForm<CRUserType>({
    defaultValues: {
      id: user?.id,
      username: user?.username,
      names: user?.names,
      phone: user?.phone,
      ci: user?.ci,
      address: user?.address,
      lastNames: user?.lastNames,
      roles: user?.roles.map((rol) => rol.id),
      status: user?.status,
      email: user?.email,
    },
  });

  const saveUpdateUser = async (data: CRUserType) => {
    await getSaveUpdateUser(data);
  };

  const getSaveUpdateUser = async (user: CRUserType) => {
    try {
      print(user);

      setLoadingModal(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users${user.id ? `/${user.id}` : ""}`,
        type: !!user.id ? "patch" : "post",
        body: {
          ...user,
        },
      });
      toast.success("Éxito", { description: MessagesInterpreter(res) });

      correctAction();
    } catch (e) {
      print(`Error al crear o actualizar user: `, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateUser)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Box height={"5px"} />
          <Typography
            sx={{ fontWeight: "medium", textAlign: "center" }}
            variant="h5"
          >
            Datos personales
          </Typography>
          <Box height={"20px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"names"}
                control={control}
                name="names"
                label="Nombres"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"lastNames"}
                control={control}
                name="lastNames"
                label="Apellidos"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"phone"}
                control={control}
                type="number"
                name="phone"
                label="Teléfono/Celular"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"email"}
                control={control}
                name="email"
                type="email"
                label="Correo electrónico"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"ci"}
                control={control}
                name="ci"
                type="text"
                label="CI"
                disabled={loadingModal}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormInputText
                id={"address"}
                control={control}
                type="text"
                name="address"
                multiline
                rows={3}
                label="Dirección"
                disabled={loadingModal}
              />
            </Grid>
          </Grid>
          <Grid>
            <Box height={"25px"} />
            <Divider />
            <Box height={"25px"} />
            <Typography
              sx={{ fontWeight: "medium", textAlign: "center" }}
              variant="h5"
            >
              Datos Acceso
            </Typography>
            <Box height={"10px"} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputText
                  id={"username"}
                  control={control}
                  name="username"
                  type="text"
                  label="Nombre de Usuario"
                  disabled={loadingModal}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormInputDropdownMultiple
                  id={"roles"}
                  name="roles"
                  control={control}
                  label="Roles"
                  disabled={loadingModal}
                  options={roles.map((rol) => ({
                    key: rol.id,
                    value: rol.id,
                    label: rol.name,
                  }))}
                  rules={{ required: "Este campo es requerido" }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box height={"20px"} />
          <LinealLoader mostrar={loadingModal} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          py: 1,
          px: 2,
          justifyContent: {
            lg: "flex-end",
            md: "flex-end",
            xs: "center",
            sm: "center",
          },
        }}
      >
        <Button
          variant={"outlined"}
          disabled={loadingModal}
          onClick={cancelAction}
        >
          Cancelar
        </Button>
        <Button variant={"contained"} disabled={loadingModal} type={"submit"}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};
