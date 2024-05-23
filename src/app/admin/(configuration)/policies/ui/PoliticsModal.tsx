import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CUPoliticsCRUDType,
  PoliticsCRUDType,
  savePoliticCRUDType,
} from "../types";
import { Button, DialogActions, DialogContent, Grid } from "@mui/material";
import { RolType } from "../../users/types";
import { useSession } from "@/hooks/useSession";
import { delay, MessagesInterpreter, print } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { FormInputDropdown } from "@/components/forms/FormInputDropdown";
import { FormInputText } from "@/components/forms";
import { LinealLoader } from "@/components/loaders";
import Box from "@mui/material/Box";
import { FormInputAutocomplete } from "@/components/forms/FormInputAutocomplete";
import { toast } from "sonner";

export interface ModalPoliticType {
  politic?: PoliticsCRUDType;
  roles: RolType[];
  accionCorrecta: () => void;
  accionCancelar: () => void;
}

export const PoliticModalView = ({
  politic,
  roles,
  accionCorrecta,
  accionCancelar,
}: ModalPoliticType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();

  const ActualPolicie: PoliticsCRUDType | undefined = politic;

  const appOptions: string[] = ["frontend", "backend"];

  const frontendOptionsAction: string[] = [
    "create",
    "read",
    "update",
    "delete",
  ];

  const backendOptionsAction: string[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ];

  const { handleSubmit, control, watch, setValue } =
    useForm<CUPoliticsCRUDType>({
      defaultValues: {
        app: politic?.app,
        action: politic?.action
          .split("|")
          .map((val) => ({ key: val, value: val, label: val })),
        object: politic?.object,
        subject: politic?.subject,
      },
    });

  const valorApp = watch("app");

  const saveUpdatePolicy = async (data: CUPoliticsCRUDType) => {
    await saveUpdatePolicie({
      ...data,
      ...{ action: data.action.map((value) => value.value).join("|") },
    });
  };

  const saveUpdatePolicie = async (newPolicy: savePoliticCRUDType) => {
    try {
      setLoadingModal(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies`,
        type: ActualPolicie ? "patch" : "post",
        body: newPolicy,
        params: {
          subject: newPolicy?.subject,
          object: newPolicy?.object,
          action: newPolicy?.action,
          app: newPolicy?.app,
        },
      });
      toast.success("Éxito", { description: MessagesInterpreter(res) });

      accionCorrecta();
    } catch (e) {
      print(`Error al crear o actualizar política`, e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdatePolicy)}>
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
                options={appOptions.map((app) => ({
                  key: app,
                  value: app,
                  label: app,
                }))}
                onChange={(event) => {
                  print(event.target.value);
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
                  ? frontendOptionsAction
                  : valorApp == "backend"
                  ? backendOptionsAction
                  : []
                ).map((actionOption) => ({
                  key: actionOption,
                  value: actionOption,
                  label: actionOption,
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
