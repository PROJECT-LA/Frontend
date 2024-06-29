import React, { useState } from "react";
import { CUControlSpecificType } from "../types";
import { useForm } from "react-hook-form";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../../config";
import { delay, MessagesInterpreter } from "@/utils";
import { toast } from "sonner";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { FormInputText } from "@/components/forms";
import { LinealLoader } from "@/components/loaders";

interface ModalControlView {
  data?: CUControlSpecificType | undefined;
  correctAction: () => void;
  cancelAction: () => void;
  groupId: string;
}

export const ModalControlSpecific = ({
  data,
  correctAction,
  cancelAction,
  groupId,
}: ModalControlView) => {
  const { sessionRequest } = useSession();
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { control, watch, handleSubmit } = useForm<CUControlSpecificType>({
    defaultValues: {
      name: data?.name,
      code: data?.code,
      description: data?.description,
      id: data?.id,
      idControlGroup: groupId,
    },
  });

  const saveUpdateControl = async (saveControl: CUControlSpecificType) => {
    try {
      setLoadingModal(true);
      await delay(300);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/controls${
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
    <form onSubmit={handleSubmit(saveUpdateControl)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Box height={10} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"controlCode"}
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
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"description"}
                control={control}
                name="description"
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

          <Box height={"15px"} />

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
