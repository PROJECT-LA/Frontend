import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CrearEditarPoliticaCRUDType,
  guardarPoliticaCRUDType,
  PoliticaCRUDType,
} from "../types";
import { RolType, RolType2 } from "@/types/users";
import { useSession } from "@/hooks/useSession";

import { delay, InterpreteMensajes } from "@/utils/utilidades";
import { Constantes } from "@/config";

import { imprimir } from "@/utils/imprimir";
import { Button, DialogActions, DialogContent, Grid } from "@mui/material";
import { FormInputDropdown } from "@/components/forms/FormInputDropdown";
import { FormInputText } from "@/components/forms";
import { ProgresoLineal } from "@/components/loaders/ProgresoLineal";
import Box from "@mui/material/Box";
import { FormInputAutocomplete } from "@/components/forms/FormInputAutocomplete";
import { toast } from "sonner";

export interface ModalPoliticaType {
  politica?: PoliticaCRUDType;
  roles: RolType2[];
  accionCorrecta: () => void;
  accionCancelar: () => void;
}

export const VistaModalPolitica = ({
  politica,
  roles,
  accionCorrecta,
  accionCancelar,
}: ModalPoliticaType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // Proveedor de la sesión
  const { sesionPeticion } = useSession();

  const politicaActual: PoliticaCRUDType | undefined = politica;

  const opcionesApp: string[] = ["frontend", "backend"];

  const opcionesAccionesFrontend: string[] = [
    "create",
    "read",
    "update",
    "delete",
  ];

  const opcionesAccionesBackend: string[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ];

  const { handleSubmit, control, watch, setValue } =
    useForm<CrearEditarPoliticaCRUDType>({
      defaultValues: {
        app: politica?.app,
        action: politica?.action
          .split("|")
          .map((val) => ({ key: val, value: val, label: val })),
        object: politica?.object,
        subject: politica?.subject,
      },
    });

  const valorApp = watch("app");

  const guardarActualizarPolitica = async (
    data: CrearEditarPoliticaCRUDType
  ) => {
    await guardarActualizarPoliticaPeticion({
      ...data,
      ...{ action: data.action.map((value) => value.value).join("|") },
    });
  };

  const guardarActualizarPoliticaPeticion = async (
    politicaNueva: guardarPoliticaCRUDType
  ) => {
    try {
      setLoadingModal(true);
      await delay(1000);
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/authorization/policies`,
        tipo: politicaActual ? "patch" : "post",
        body: politicaNueva,
        params: {
          sujeto: politicaActual?.subject,
          objeto: politicaActual?.object,
          accion: politicaActual?.action,
          app: politicaActual?.app,
        },
      });
      toast.success("Éxito", { description: InterpreteMensajes(respuesta) });

      accionCorrecta();
    } catch (e) {
      imprimir(`Error al crear o actualizar política`, e);
      toast.error("Error", { description: InterpreteMensajes(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(guardarActualizarPolitica)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id={"sujeto"}
                name="subject"
                control={control}
                label="Sujeto"
                disabled={loadingModal}
                options={roles.map((rol) => ({
                  key: rol.id,
                  value: rol.description,
                  label: rol.name,
                }))}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"objeto"}
                control={control}
                name="object"
                label="Objeto"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"15px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id={"app"}
                name="app"
                control={control}
                label="App"
                disabled={loadingModal}
                options={opcionesApp.map((app) => ({
                  key: app,
                  value: app,
                  label: app,
                }))}
                onChange={(event) => {
                  imprimir(event.target.value);
                  setValue("action", []);
                }}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputAutocomplete
                id={"accion"}
                name="action"
                control={control}
                label="Acción"
                multiple
                forcePopupIcon
                freeSolo
                newValues
                disabled={loadingModal}
                options={(valorApp == "frontend"
                  ? opcionesAccionesFrontend
                  : valorApp == "backend"
                  ? opcionesAccionesBackend
                  : []
                ).map((opcionAccion) => ({
                  key: opcionAccion,
                  value: opcionAccion,
                  label: opcionAccion,
                }))}
                rules={{ required: "Este campo es requerido" }}
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <>{option.label}</>}
                isOptionEqualToValue={(option, value) =>
                  option.value == value.value
                }
              />
            </Grid>
          </Grid>
          <Box height={"20px"} />
          <ProgresoLineal mostrar={loadingModal} />
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
        <Button
          name={"guardar_politica"}
          variant={"contained"}
          disabled={loadingModal}
          type={"submit"}
        >
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};
