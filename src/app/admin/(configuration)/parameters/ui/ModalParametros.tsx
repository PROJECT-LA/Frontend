import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material";
import { CrearEditarParametroCRUDType, ParametroCRUDType } from "../types";
import { useSession } from "@/hooks/useSession";
import { delay, MessagesInterpreter } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { print } from "@/utils";
import { FormInputText } from "@/components/forms";
import { toast } from "sonner";
import { LinealLoader } from "@/components/loaders";
export interface ModalParametroType {
  parametro?: ParametroCRUDType | null;
  accionCorrecta: () => void;
  accionCancelar: () => void;
}

export const VistaModalParametro = ({
  parametro,
  accionCorrecta,
  accionCancelar,
}: ModalParametroType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const { sessionRequest } = useSession();

  const { handleSubmit, control } = useForm<CrearEditarParametroCRUDType>({
    defaultValues: {
      id: parametro?.id,
      code: parametro?.code,
      description: parametro?.description,
      name: parametro?.name,
      group: parametro?.group,
    },
  });

  const guardarActualizarParametro = async (
    data: CrearEditarParametroCRUDType
  ) => {
    await guardarActualizarParametrosPeticion(data);
  };

  const guardarActualizarParametrosPeticion = async (
    parametro: CrearEditarParametroCRUDType
  ) => {
    try {
      setLoadingModal(true);
      await delay(1000);
      const respuesta = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/parameters${
          parametro.id ? `/${parametro.id}` : ""
        }`,
        type: !!parametro.id ? "patch" : "post",
        body: parametro,
      });
      toast.success("Éxito", { description: MessagesInterpreter(respuesta) });
      accionCorrecta();
    } catch (e) {
      print(`Error al crear o actualizar parámetro`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(guardarActualizarParametro)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"code"}
                control={control}
                name="code"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"name"}
                control={control}
                name="name"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"15px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"group"}
                control={control}
                name="group"
                label="Grupo"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"description"}
                control={control}
                name="description"
                label="Decripción"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"10px"} />
          <LinealLoader mostrar={loadingModal} />
          <Box height={"5px"} />
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
