/// Vista modal de usuario
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CrearEditarUsuarioType, RolType, UsuarioRolCRUDType } from "../types";
import { useSession } from "@/hooks/useSession";
import { delay, InterpreteMensajes, print } from "@/utils";
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

export interface ModalUsuarioType {
  usuario?: UsuarioRolCRUDType | undefined | null;
  roles: RolType[];
  accionCorrecta: () => void;
  accionCancelar: () => void;
}

export const VistaModalUsuario = ({
  usuario,
  roles,
  accionCorrecta,
  accionCancelar,
}: ModalUsuarioType) => {
  // Flag que índica que hay un proceso en ventana modal cargando visualmente
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // Proveedor de la sesión
  const { sessionRequest } = useSession();

  const { handleSubmit, control } = useForm<CrearEditarUsuarioType>({
    defaultValues: {
      id: usuario?.id,
      username: usuario?.username,
      names: usuario?.names,
      phone: usuario?.phone,
      lastNames: usuario?.lastNames,
      password: usuario?.password,
      roles: usuario?.roles.map((rol) => rol.id),
      status: usuario?.status,
      email: usuario?.email,
    },
  });

  const guardarActualizarUsuario = async (data: CrearEditarUsuarioType) => {
    await guardarActualizarUsuariosPeticion(data);
  };

  const guardarActualizarUsuariosPeticion = async (
    usuario: CrearEditarUsuarioType
  ) => {
    try {
      print(usuario);

      setLoadingModal(true);
      await delay(1000);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users${usuario.id ? `/${usuario.id}` : ""}`,
        type: !!usuario.id ? "patch" : "post",
        body: {
          ...usuario,
        },
      });
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });

      accionCorrecta();
    } catch (e) {
      print(`Error al crear o actualizar usuario: `, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
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
          </Grid>
          <Grid>
            <Box height={"25px"} />
            <Divider />
            <Box height={"25px"} />
            <Typography
              sx={{ fontWeight: "medium", textAlign: "center" }}
              variant="h5"
            >
              Autorización del usuario
            </Typography>
            <Box height={"10px"} />
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputText
                  id={"username"}
                  control={control}
                  name="username"
                  label="Usuario"
                  disabled={loadingModal}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputText
                  id={"password"}
                  control={control}
                  name="password"
                  type="password"
                  label="Contraseña"
                  disabled={loadingModal}
                />
              </Grid>
              {/* </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={'email'}
                control={control}
                name="repassword"
                type="re"
                label="Verificar contraseña"
                disabled={loadingModal}
              />
            </Grid> */}
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
          my: 1,
          mx: 2,
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
          onClick={accionCancelar}
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
