import React, { useEffect, useState } from "react";
import { CUAudit } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
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
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { ControlGroupType } from "../../controls/types";

interface AuditModalView {
  audit?: CUAudit | undefined;
  templatesData: TemplatesData[];
  levelsData: LevelData[];
  idClient: string;
  correctAction: () => void;
  cancelAction: () => void;
}

interface StepAudit {
  name: string;
  completed: boolean;
}

const initialSteps: StepAudit[] = [
  { name: "Audtoría", completed: false },
  { name: "Grupos de control", completed: false },
  { name: "Auditores", completed: false },
];

const AuditModalView = ({
  templatesData,
  levelsData,
  idClient,
  audit,
  correctAction,
  cancelAction,
}: AuditModalView) => {
  const theme = useTheme();
  const [loadingControl, setLoadingControl] = useState<boolean>(true);
  const [dataControl, setDataControl] = useState<ControlGroupType[]>([]);

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
  const idTemplateValue = watch("idTemplate");

  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = useState<StepAudit[]>(initialSteps);

  const onClickStep = (step: number) => () => {
    console.log(step);
    setActiveStep(step);
  };

  const getControlGroupData = async () => {
    console.log(idTemplateValue);

    console.log(idTemplateValue);

    try {
      setLoadingControl(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups`,
        params: {
          page: 1,
          limit: 30,
          idTemplate: idTemplateValue,
        },
      });
      setDataControl(res.data.rows);
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingControl(false);
    }
  };

  useEffect(() => {
    if (idTemplateValue && activeStep == 1) {
      getControlGroupData()
        .then(() => {})
        .finally(() => {});
    }
    // eslint-disable-next-line
  }, [activeStep]);

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
        beginDate: dayjs(audit.beginDate).format("YYYY-MM-DD"),
        finalDate: dayjs(audit.finalDate).format("YYYY-MM-DD"),
      };
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/audits`,
        type: !!audit.id ? "patch" : "post",
        body: sendAudit,
      });
      toast.success(MessagesInterpreter(res));
      await correctAction();
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateAudit)}>
      <DialogContent dividers>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label.name} completed={label.completed}>
              <StepButton color="inherit" onClick={onClickStep(index)}>
                {label.name}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Box height={20} />

        <>
          {activeStep === 0 && (
            <Grid
              container
              direction={"column"}
              justifyContent="space-evenly"
              paddingX={{ lg: 6 }}
            >
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
              {idLevelValue && idLevelValue.length > 0 && (
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
          )}

          {activeStep === 1 && (
            <Grid container direction={"column"} justifyContent="space-evenly">
              {/* <Box width="100%" textAlign="center">
                <Typography variant="h4">Grupos de Control</Typography>
              </Box> */}

              <>
                {idTemplateValue.length > 0 ? (
                  <>
                    {loadingControl ? (
                      <LoaderCircle color={theme.palette.secondary.main} />
                    ) : (
                      <Grid
                        container
                        direction={"column"}
                        justifyContent="space-evenly"
                      >
                        <Stack>
                          {dataControl.map((elem) => (
                            <Stack
                              key={`control-group-${elem.id}-${elem.groupCode}`}
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Checkbox />
                              <Typography variant="h6">
                                {elem.groupCode}
                              </Typography>
                              <Typography>{elem.group}</Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </>
                ) : (
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    marginY={10}
                  >
                    <Typography>
                      Debe de seleccionar una plantilla primero
                    </Typography>
                    <Typography variant="h5">Vuelva al paso 1</Typography>
                  </Stack>
                )}
              </>

              <Box height={10} />
            </Grid>
          )}
        </>

        <Stack direction="row" justifyContent="space-between">
          <div>
            {activeStep > 0 && (
              <Button
                startIcon={<ChevronLeft size={15} />}
                variant={"contained"}
                onClick={onClickStep(activeStep - 1)}
              >
                Anterior
              </Button>
            )}
          </div>

          <div>
            {activeStep < 2 && (
              <Button
                endIcon={<ChevronRight size={15} />}
                sx={{ paddingY: 0.4 }}
                variant={"contained"}
                onClick={onClickStep(activeStep + 1)}
              >
                Siguiente
              </Button>
            )}
          </div>
        </Stack>

        <Box height={"10px"} />
        <LinealLoader mostrar={loadingModal} />
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: "space-between",
        }}
      >
        <Button
          variant={"outlined"}
          disabled={loadingModal}
          onClick={cancelAction}
        >
          Cancelar
        </Button>
        <Button variant={"contained"} disabled={true} type={"submit"}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};

export default AuditModalView;
