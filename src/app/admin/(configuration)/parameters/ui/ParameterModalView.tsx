import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material";
import { CUParameterCRUDType, ParameterCRUDType } from "../types";
import { useSession } from "@/hooks/useSession";
import { delay, MessagesInterpreter } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { print } from "@/utils";
import { FormInputText } from "@/components/forms";
import { toast } from "sonner";
import { LinealLoader } from "@/components/loaders";

export interface ModalParameterType {
  parameter?: ParameterCRUDType | null;
  correctAction: () => void;
  cancelAction: () => void;
}

export const ParameterModalView = ({
  parameter,
  correctAction,
  cancelAction,
}: ModalParameterType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const { sessionRequest } = useSession();

  const { handleSubmit, control } = useForm<CUParameterCRUDType>({
    defaultValues: {
      id: parameter?.id,
      code: parameter?.code,
      description: parameter?.description,
      name: parameter?.name,
      group: parameter?.group,
    },
  });

  const saveUpdateParameter = async (data: CUParameterCRUDType) => {
    await requestSaveUpdateParameter(data);
  };

  const requestSaveUpdateParameter = async (parameter: CUParameterCRUDType) => {
    try {
      setLoadingModal(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/parameters${
          parameter.id ? `/${parameter.id}` : ""
        }`,
        type: !!parameter.id ? "patch" : "post",
        body: parameter,
      });
      toast.success("Éxito", { description: MessagesInterpreter(res) });
      correctAction();
    } catch (e) {
      print(`Error al crear o actualizar parámetro`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateParameter)}>
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
