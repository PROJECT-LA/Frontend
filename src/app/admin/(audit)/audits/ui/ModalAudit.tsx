import React, { useState } from "react";
import { CUAudit } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material";
import {
  FormInputDropdown,
  FormInputSlider,
  FormInputText,
} from "@/components/forms";
import { toast } from "sonner";
import { MessagesInterpreter } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { LinealLoader } from "@/components/loaders";
import { FormInputDate } from "@/components/forms/FormInputDate";
import dayjs from "dayjs";
import { TemplatesData } from "../../templates/types";
import { LevelData } from "../../levels/types";

interface AuditModalView {
  audit?: CUAudit | undefined;
  templatesData: TemplatesData[];
  levelsData: LevelData[];
  idClient: string;
  correctAction: () => void;
  cancelAction: () => void;
}

const AuditModalView = ({
  templatesData,
  levelsData,
  idClient,
  audit,
  correctAction,
  cancelAction,
}: AuditModalView) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();
  const { control, handleSubmit, watch, setValue } = useForm<CUAudit>({
    defaultValues: {
      id: audit?.id,
      acceptanceLevel: audit?.acceptanceLevel,
      beginDate: audit?.beginDate,
      finalDate: audit?.finalDate,
      description: audit?.description,
      idClient,

      idTemplate: audit?.idTemplate,
      idLevel: audit?.idLevel,
      objective: audit?.objective,
    },
  });

  const idLevelValue = watch("idLevel");

  const saveUpdateAudit = async (audit: CUAudit) => {
    try {
      setLoadingModal(true);
      const sendAudit: CUAudit = {
        id: audit.id,
        acceptanceLevel: audit.acceptanceLevel,
        objective: audit.objective,
        description: audit.description,
        idClient: audit.idClient,
        idLevel: audit.idLevel,
        idTemplate: audit.idTemplate,
        beginDate: dayjs(audit.beginDate).format("D-M-YYYY"),
        finalDate: dayjs(audit.finalDate).format("D-M-YYYY"),
      };
      console.log("*******************************");
      console.log(sendAudit);
      console.log("*******************************");

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/audits`,
        type: !!audit.id ? "patch" : "post",
        body: sendAudit,
      });
      toast.success(MessagesInterpreter(res));
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateAudit)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"objective"}
                control={control}
                name="objective"
                label="Objetivo"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={10} />
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
          </Grid>
          <Box height={10} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDate
                id={"beginDate"}
                name="beginDate"
                label="Fecha inicio"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDate
                id={"finalDate"}
                name="finalDate"
                label="Fecha fin"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
                control={control}
              />
            </Grid>
          </Grid>
          <Box height={10} />

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id="idTemplate"
                name="idTemplate"
                control={control}
                label="Selecciona un plantilla"
                options={templatesData.map((elem) => ({
                  key: elem.id,
                  value: elem.id,
                  label: elem.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputDropdown
                id="idLevel"
                name="idLevel"
                control={control}
                label="Selecciona un nivel"
                options={levelsData.map((elem) => ({
                  key: elem.id,
                  value: elem.id,
                  label: elem.name,
                }))}
              />
            </Grid>
          </Grid>

          <Box height={10} />
          {idLevelValue !== undefined && (
            <Grid item xs={12} sm={12} md={12}>
              <FormInputSlider
                id={"level"}
                control={control}
                setValue={setValue}
                name="acceptanceLevel"
                label="Nivel de aceptación"
                steps={1}
                min={0}
                max={Number(
                  levelsData.find((elem) => elem.id === idLevelValue)?.grade
                )}
                initialValue={0}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          )}

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

export default AuditModalView;
