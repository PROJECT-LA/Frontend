"use client";

import React, { useState } from "react";
import { CULevel } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { LinealLoader } from "@/components/loaders";
import { FormInputText, FormInputSlider } from "@/components/forms";
import { toast } from "sonner";
import { MessagesInterpreter, delay } from "@/utils";
import { CONSTANTS } from "../../../../../../config";

interface TemplatesModalView {
  level?: CULevel | undefined;
  correctAction: () => void;
  cancelAction: () => void;
}

export const LevelsModalView = ({
  level,
  correctAction,
  cancelAction,
}: TemplatesModalView) => {
  const { sessionRequest } = useSession();
  const { control, watch, handleSubmit, setValue } = useForm<CULevel>({
    defaultValues: {
      id: level?.id,
      description: level?.description,
      level: level?.level ?? 0,
    },
  });
  const levelValue = watch("level");

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const saveUpdateTemplate = async (template: CULevel) => {
    try {
      setLoadingModal(true);
      await delay(300);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/levels${
          template.id ? `/${template.id}` : ""
        }`,
        type: !!template.id ? "patch" : "post",
        body: template,
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
    <form onSubmit={handleSubmit(saveUpdateTemplate)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"description"}
                control={control}
                name="description"
                label="Descripción"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputSlider
                id={"level"}
                control={control}
                setValue={setValue}
                name="level"
                label="Nivel"
                steps={1}
                min={0}
                max={10}
                initialValue={level?.level}
                rules={{ required: "Este campo es requerido" }}
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
