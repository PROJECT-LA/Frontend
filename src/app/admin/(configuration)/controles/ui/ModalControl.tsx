import { MessagesInterpreter, delay } from "@/utils";
import React, { useState } from "react";
import { CONSTANTS } from "../../../../../../config";
import { toast } from "sonner";
import { CUControlType, ControlType } from "../types";
import { useForm } from "react-hook-form";
import { useSession } from "@/hooks/useSession";
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
  idTemplate: string;
  controls?: ControlType | undefined;
  correctAction: () => void;
  cancelAction: () => void;
}

export const ModalControlView = ({
  cancelAction,
  correctAction,
  idTemplate,
  controls,
}: ModalControlView) => {
  const { sessionRequest } = useSession();
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { control, watch, handleSubmit } = useForm<CUControlType>({
    defaultValues: {
      id: controls?.id,

      oControl: controls?.oControlDescription,
      oControlDescription: controls?.oControlDescription,
      oControlCode: controls?.oControlCode,

      gControl: controls?.gControlDescription,
      gControlDescription: controls?.gControlDescription,
      gControlCode: controls?.gControlCode,

      eControl: controls?.eControlDescription,
      eControlDescription: controls?.eControlDescription,
      eControlCode: controls?.eControlCode,

      idTemplate,
    },
  });

  const saveUpdateControl = async (saveControl: CUControlType) => {
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
            <Typography variant="h5">Objetivo del control</Typography>
          </Grid>
          <Box height={10} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"oControlCode"}
                control={control}
                name="oControlCode"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"oControl"}
                control={control}
                name="oControl"
                label="Control"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>

          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"oControlDescription"}
                control={control}
                name="oControlDescription"
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

          <Box height={"25px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Typography variant="h5">Nivel general de aprobación</Typography>
          </Grid>
          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"gControlCode"}
                control={control}
                name="gControlCode"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"gControl"}
                control={control}
                name="gControl"
                label="Control"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>

          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"gControlDescription"}
                control={control}
                name="gControlDescription"
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
          <Box height={"25px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Typography>-----------------</Typography>
          </Grid>
          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"eControlCode"}
                control={control}
                name="eControlCode"
                label="Código"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"eControl"}
                control={control}
                name="eControl"
                label="Control"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>

          <Box height={"15px"} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"eControlDescription"}
                control={control}
                name="eControlDescription"
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
