import React, { useState } from "react";
import { CUControlGroupType } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { MessagesInterpreter, delay } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { toast } from "sonner";
import { LinealLoader } from "@/components/loaders";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { FormInputText } from "@/components/forms";

interface ModalControlGroupView {
  data?: CUControlGroupType | undefined;
  correctAction: () => void;
  cancelAction: () => void;
}

export const ModalControlGroup = ({
  data,
  correctAction,
  cancelAction,
}: ModalControlGroupView) => {
  const { sessionRequest } = useSession();
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { control, watch, handleSubmit } = useForm<CUControlGroupType>({
    defaultValues: {
      id: data?.id,
      idTemplate: data?.idTemplate,

      group: data?.group,
      groupCode: data?.groupCode,
      groupDescription: data?.groupDescription,
      objective: data?.objective,
      objectiveCode: data?.objective,
      objectiveDescription: data?.objectiveDescription,
    },
  });

  const saveUpdateControlGroup = async (saveControl: CUControlGroupType) => {
    try {
      setLoadingModal(true);
      await delay(300);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups${
          saveControl.id ? `/${saveControl.id}` : ""
        }`,
        type: !!saveControl.id ? "patch" : "post",
        body: saveControl,
      });
      toast.success(MessagesInterpreter(res));
      correctAction();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateControlGroup)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Control grupo
          </Typography>
          <Box height={10} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"groupCode"}
                control={control}
                name="groupCode"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"groupName"}
                control={control}
                name="group"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>

          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"groupDescription"}
                control={control}
                name="groupDescription"
                label="Descripción"
                disabled={loadingModal}
                rules={{
                  required: {
                    value: true,
                    message: "Este campo es requerido",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box height={15} />

          <Divider />
          <Box height={10} />

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Control objetivo
          </Typography>
          <Box height={10} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"objectiveCode"}
                control={control}
                name="objectiveCode"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"nameObjective"}
                control={control}
                name="objective"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>

          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"objectiveDescription"}
                control={control}
                name="objectiveDescription"
                label="Descripción"
                disabled={loadingModal}
                rules={{
                  required: {
                    value: true,
                    message: "Este campo es requerido",
                  },
                }}
              />
            </Grid>
          </Grid>

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
