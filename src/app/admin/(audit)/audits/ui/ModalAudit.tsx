import React, { ReactNode, useEffect, useState } from "react";
import { CUAudit, CreateAudit, initialCreateAudit } from "../types";
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
import { FormInputDropdown, FormInputText } from "@/components/forms";
import { toast } from "sonner";
import { MessagesInterpreter } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { LinealLoader } from "@/components/loaders";
import { FormInputDate } from "@/components/forms/FormInputDate";
import { TemplatesData } from "../../templates/types";
import { LevelData } from "../../levels/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Save,
  UserCheck,
} from "lucide-react";
import { ControlGroupType } from "../../controls/types";
import { SortTypeCriteria } from "@/types";
import { Pagination } from "@/components/datatable";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { UserRolCRUDType } from "@/app/admin/(configuration)/users/types";
import dayjs from "dayjs";

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
  { name: "Configuración", completed: false },
  { name: "Grupos de control", completed: false },
  { name: "Asignar auditores", completed: false },
  { name: "Finalizar", completed: false },
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
  const [loadingAuditor, setLoadingAuditor] = useState<boolean>(true);
  const [createAudit, setCreateAudit] =
    useState<CreateAudit>(initialCreateAudit);

  const [dataControl, setDataControl] = useState<ControlGroupType[]>([]);
  const [dataAuditors, setDataAuditors] = useState<UserRolCRUDType[]>([]);

  const [limitControls, setLimitControls] = useState<number>(10);
  const [pageControls, setPageControls] = useState<number>(1);
  const [totalControls, setTotalControls] = useState<number>(0);

  const [limitAuditors, setLimitAuditors] = useState<number>(10);
  const [pageAuditors, setPageAuditors] = useState<number>(1);
  const [totalAuditors, setTotalAuditors] = useState<number>(0);

  const [controlCriteria, setControlCriteria] = useState<
    Array<SortTypeCriteria>
  >([
    { field: "group", name: "Código grupo" },
    { field: "groupName", name: "Nombre grupo" },
    { field: "object", name: "Código objetivo" },
    { field: "objectName", name: "Nombre objetivo" },
    { field: "add", name: "Añadir" },
  ]);
  const controlTable: Array<Array<ReactNode>> = dataControl.map(
    (controlGroupData, indexGroupData) => [
      <Typography
        key={`${controlGroupData.id}-${indexGroupData}-code`}
        variant={"subtitle2"}
      >{`${controlGroupData.groupCode}`}</Typography>,
      <Typography
        key={`${controlGroupData.id}-${indexGroupData}-name`}
        variant={"subtitle2"}
      >{`${controlGroupData.group}`}</Typography>,
      <Typography
        key={`${controlGroupData.id}-${indexGroupData}-code`}
        variant={"subtitle2"}
      >{`${controlGroupData.groupCode}`}</Typography>,
      <Typography
        key={`${controlGroupData.id}-${indexGroupData}-name`}
        variant={"subtitle2"}
      >{`${controlGroupData.group}`}</Typography>,
      <Checkbox
        key={`check-control-group-${indexGroupData}`}
        color="secondary"
        checked={createAudit.groupControls.some(
          (elemControl) => elemControl.id === controlGroupData.id
        )}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            setCreateAudit({
              ...createAudit,
              groupControls: [...createAudit.groupControls, controlGroupData],
            });
          } else {
            const newGroupControls: ControlGroupType[] | undefined =
              createAudit?.groupControls.filter(
                (elem) => elem.id !== controlGroupData.id
              );
            setCreateAudit({
              ...createAudit,
              groupControls: newGroupControls,
            });
          }
        }}
      />,
    ]
  );

  const [auditorCriteria, setAuditorCriteria] = useState<
    Array<SortTypeCriteria>
  >([
    { field: "names", name: "Nombres" },
    { field: "lastNames", name: "Apellidos" },
    { field: "email", name: "Correo" },
    { field: "phone", name: "Teléfono" },
    { field: "add", name: "Asignar" },
  ]);

  const auditorTable: Array<Array<ReactNode>> = dataAuditors.map(
    (auditorData, indexAuditorData) => [
      <Typography
        key={`${auditorData.id}-${indexAuditorData}-name`}
        variant={"subtitle2"}
      >{`${auditorData.names}`}</Typography>,
      <Typography
        key={`${auditorData.id}-${indexAuditorData}-last-name`}
        variant={"subtitle2"}
      >{`${auditorData.lastNames}`}</Typography>,
      <Typography
        key={`${auditorData.id}-${indexAuditorData}-email`}
        variant={"subtitle2"}
      >{`${auditorData.email}`}</Typography>,
      <Typography
        key={`${auditorData.id}-${indexAuditorData}-phone`}
        variant={"subtitle2"}
      >{`${auditorData.phone}`}</Typography>,
      <Checkbox
        key={`check-auditor-user-${indexAuditorData}`}
        color="secondary"
        checked={createAudit.auditors.some(
          (elemAudit) => elemAudit.id === auditorData.id
        )}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.checked) {
            setCreateAudit({
              ...createAudit,
              auditors: [...createAudit.auditors, auditorData],
            });
          } else {
            const newAudit: UserRolCRUDType[] | undefined =
              createAudit?.auditors.filter(
                (elem) => elem.id !== auditorData.id
              );
            setCreateAudit({
              ...createAudit,
              auditors: newAudit,
            });
          }
        }}
      />,
    ]
  );

  const paginationControls = (
    <Pagination
      page={pageControls}
      limit={limitControls}
      total={totalControls}
      changePage={setPageControls}
      changeLimit={setLimitControls}
    />
  );

  const paginationAuditors = (
    <Pagination
      page={pageAuditors}
      limit={limitAuditors}
      total={totalAuditors}
      changePage={setPageAuditors}
      changeLimit={setLimitAuditors}
    />
  );

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();
  const { control, handleSubmit, watch } = useForm<CUAudit>({
    defaultValues: {
      id: audit?.id,
      beginDate: audit?.beginDate,
      finalDate: audit?.finalDate,
      description: audit?.description,
      idClient,

      idTemplate: audit?.idTemplate,
      idLevel: audit?.idLevel,
      objective: audit?.objective,
    },
  });

  const idTemplateValue = watch("idTemplate");

  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = useState<StepAudit[]>(initialSteps);

  const getControlGroupData = async () => {
    try {
      setLoadingControl(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups`,
        params: {
          page: pageControls,
          limit: limitControls,
          idTemplate: idTemplateValue,
          status: "ACTIVE",
        },
      });
      setDataControl(res.data.rows);
      setTotalControls(res.data.total);
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingControl(false);
    }
  };

  const getAuditorData = async () => {
    try {
      setLoadingAuditor(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/users`,
        params: {
          page: pageAuditors,
          limit: limitAuditors,
          status: "ACTIVE",
          idRole: 4, // TODO: Se puso manualmente
        },
      });
      setDataAuditors(res.data.rows);
      setTotalAuditors(res.data.total);
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingAuditor(false);
    }
  };

  useEffect(() => {
    if (idTemplateValue && activeStep == 1) {
      getControlGroupData()
        .then(() => {})
        .finally(() => {});
    }
    if (idTemplateValue && activeStep == 2) {
      getAuditorData()
        .then(() => {})
        .finally(() => {});
    }
    // eslint-disable-next-line
  }, [activeStep, pageControls, limitControls, pageAuditors, limitAuditors]);

  const temporalSaveForm = async (audit: CUAudit) => {
    setCreateAudit({
      objective: audit.objective,
      description: audit.description,
      idClient: audit.idClient,
      idLevel: audit.idLevel,
      idTemplate: audit.idTemplate,
      beginDate: dayjs(audit.beginDate).format("YYYY-MM-DD"),
      finalDate: dayjs(audit.finalDate).format("YYYY-MM-DD"),
      auditors: [],
      groupControls: [],
    });
    setActiveStep(1);
  };

  const saveAudit = async () => {
    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/audits`,
        type: "post",
        body: createAudit,
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
    <form onSubmit={handleSubmit(temporalSaveForm)}>
      <DialogContent dividers>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label.name} completed={label.completed}>
              <StepButton color="inherit">{label.name}</StepButton>
            </Step>
          ))}
        </Stepper>

        <Box height={20} />

        <>
          {activeStep === 0 && (
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
                    rules={{ required: "Este campo es requerido" }}
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
                    rules={{ required: "Este campo es requerido" }}
                    options={levelsData.map((elem) => ({
                      key: elem.id,
                      value: elem.id,
                      label: elem.name,
                    }))}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container direction={"column"} justifyContent="space-evenly">
              <>
                {idTemplateValue.length > 0 ? (
                  <>
                    <CustomDataTable
                      error={undefined}
                      loading={loadingControl}
                      inModal={true}
                      actions={[]}
                      columns={controlCriteria}
                      changeOrderCriteria={setControlCriteria}
                      pagination={paginationControls}
                      tableContent={controlTable}
                    />
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
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container direction={"column"} justifyContent="space-evenly">
              <>
                {idTemplateValue.length > 0 ? (
                  <CustomDataTable
                    error={undefined}
                    loading={loadingAuditor}
                    actions={[]}
                    inModal={true}
                    columns={auditorCriteria}
                    changeOrderCriteria={setAuditorCriteria}
                    pagination={paginationAuditors}
                    tableContent={auditorTable}
                  />
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
            </Grid>
          )}

          {activeStep === 3 && (
            <Grid container spacing={1} justifyContent="space-evenly">
              <Grid item xs={4}>
                <Stack
                  border={0.2}
                  borderColor={theme.palette.secondary.main}
                  borderRadius={1}
                  padding={1.5}
                >
                  <Box textAlign="center" marginBottom={1.5}>
                    <Typography variant="h5">Configuración</Typography>
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Objetivo
                    </Typography>
                    <Typography variant="subtitle2">
                      {createAudit.objective}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Descripción
                    </Typography>
                    <Typography variant="subtitle2">
                      {createAudit.description}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Fecha de inicio
                    </Typography>
                    <Typography variant="subtitle2">
                      {createAudit.beginDate}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Fecha final
                    </Typography>
                    <Typography variant="subtitle2">
                      {createAudit.finalDate}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Plantilla
                    </Typography>
                    <Typography variant="subtitle2">
                      {(() => {
                        const templateInfo = templatesData.find(
                          (elem) => elem.id === createAudit.idTemplate
                        );
                        return templateInfo
                          ? `${templateInfo.version} - ${templateInfo.name}`
                          : "Plantilla no encontrada";
                      })()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.3}>
                    <Check size={18} color={theme.palette.secondary.main} />
                    <Typography variant="subtitle2" fontWeight="bold">
                      Nivel
                    </Typography>
                    <Typography variant="subtitle2">
                      {
                        levelsData.find(
                          (elem) => elem.id == createAudit.idLevel
                        )?.name
                      }
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack
                  border={0.2}
                  borderColor={theme.palette.secondary.main}
                  borderRadius={1}
                  paddingY={1.5}
                  paddingX={3}
                >
                  <Box textAlign="center" marginBottom={1.5}>
                    <Typography variant="h5">Grupos de control</Typography>
                  </Box>
                  {createAudit.groupControls.map((elem) => (
                    <Stack
                      key={`control-group-summary-${elem}`}
                      direction="row"
                      alignItems="center"
                      spacing={1.3}
                    >
                      <CircleCheck
                        size={18}
                        color={theme.palette.secondary.main}
                      />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {elem.groupCode}
                      </Typography>
                      <Typography variant="subtitle2">{elem.group}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={4}>
                <Stack
                  border={0.2}
                  borderColor={theme.palette.secondary.main}
                  borderRadius={1}
                  paddingY={1.5}
                  paddingX={3}
                >
                  <Box textAlign="center" marginBottom={1.5}>
                    <Typography variant="h5">Auditores asignados</Typography>
                  </Box>
                  {createAudit.auditors.map((elem) => (
                    <Stack
                      key={`control-group-summary-${elem}`}
                      direction="row"
                      alignItems="center"
                      spacing={1.3}
                    >
                      <UserCheck
                        size={18}
                        color={theme.palette.secondary.main}
                      />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {elem?.names}
                      </Typography>
                      <Typography variant="subtitle2">
                        {elem?.lastNames}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          )}
        </>

        <LinealLoader mostrar={loadingModal} />
        <Box height={"10px"} />
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
        <Stack direction="row" spacing={1}>
          <div>
            {activeStep > 0 && (
              <Button
                startIcon={<ChevronLeft size={15} />}
                sx={{ paddingY: 0.4 }}
                variant={"contained"}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Anterior
              </Button>
            )}
          </div>

          <div>
            {activeStep < 3 && activeStep !== 0 && (
              <Button
                endIcon={<ChevronRight size={15} />}
                sx={{ paddingY: 0.4 }}
                variant={"contained"}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Siguiente
              </Button>
            )}

            {activeStep === 0 && (
              <Button
                endIcon={<ChevronRight size={15} />}
                type="submit"
                sx={{ paddingY: 0.4 }}
                variant={"contained"}
              >
                Siguiente
              </Button>
            )}

            {activeStep === 3 && (
              <Button
                endIcon={<Save size={16} />}
                type="submit"
                sx={{ paddingY: 0.4 }}
                variant={"contained"}
                onClick={() => saveAudit()}
              >
                Guardar
              </Button>
            )}
          </div>
        </Stack>
      </DialogActions>
    </form>
  );
};

export default AuditModalView;
