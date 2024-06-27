"use client";
import { FormInputAutocomplete } from "@/components/forms";
import { optionType } from "@/components/forms/FormInputDropdown";
import { useSession } from "@/hooks/useSession";
import { MessagesInterpreter, delay } from "@/utils";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CONSTANTS } from "../../../../../config";
import MainCard from "@/components/cards/MainCard";
import { useAuthStore } from "@/store";
import { UserAudit } from "../audits/types";
import { ControlGroupType } from "../controls/types";
import { Minus, Plus } from "lucide-react";

interface AssessmentsPageClient {
  idTemplate?: string;
}

interface VersionData {
  id: string;
  nombre: string;
}
const versionData: VersionData[] = [
  { id: "1", nombre: "1ra Revisión" },
  { id: "2", nombre: "2da Revisión" },
];

interface TabSelector {
  id: string;
  type: "CONTROLS" | "DOCUMENTS";
  value: string;
}

const ArrayFilterCustomTab: TabSelector[] = [
  {
    id: "1",
    type: "CONTROLS",
    value: "Controles",
  },
  {
    id: "2",
    type: "DOCUMENTS",
    value: "Documentos",
  },
];

const AssessmentsPageClient = ({ idTemplate }: AssessmentsPageClient) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { getPermissions, sessionRequest } = useSession();
  const [optionsGroup, setOptionsGroup] = useState<Array<optionType>>([]);
  const [optionsUsers, setOptionsUsers] = useState<Array<optionType>>([]);
  const [optionsAudits, setOptionsAudits] = useState<Array<optionType>>([]);
  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);

  const [selectedGroupControl, setSelectedGroupControl] = useState<string>("");

  const [idAudit, setIdAudit] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);

  const [userAudit, setUserAudit] = useState<UserAudit[]>([]);

  const { control, watch } = useForm<{
    searchControlGroup: string;
    selectUsers: string;
    selectAudit: string;
  }>({
    defaultValues: {
      searchControlGroup: "",
      selectUsers: "",
      selectAudit: "",
    },
  });

  const idSelectAudit = watch("selectAudit");

  const handleChangeToggleButton = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const getAssessmentsAndUsers = async () => {
    try {
      setLoading(true);
      if (user?.idRole !== undefined) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/users/${user?.idRole}/role`,
        });
        console.log(res.data);
        const optionUsersTemp: Array<optionType> = [];
        for (const elemUser of res.data) {
          optionUsersTemp.push({
            key: `option-user-${elemUser.id}`,
            label: `${elemUser.names} ${elemUser.lastNames}`,
            value: elemUser.id,
          });
        }
        setOptionsUsers(optionUsersTemp);
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const getAudits = async (id?: string) => {
    try {
      setLoading(true);
      if (user?.idRole !== undefined) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/audits`,
          params: {
            idClient: id ? id : user?.id,
          },
        });
        const optionsAuditsTemp: Array<optionType> = [];
        for (const elemAudit of res.data.rows) {
          optionsAuditsTemp.push({
            key: `option-audit-${elemAudit.id}`,
            label: `${elemAudit.objective}`,
            value: elemAudit.id,
          });
        }
        setOptionsAudits(optionsAuditsTemp);
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };

  const getAssessment = async (idAudit: string) => {
    try {
      setLoading(true);
      if (user?.idRole !== undefined) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups`,
          params: {
            page: 1,
            limit: 30,
            idTemplate: "1",
          },
        });
        setDataControls(res.data?.rows);

        const res2 = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/assessment`,
          params: {
            idAudit,
          },
        });
        console.log("**************");
        console.log(res2.data);
        console.log("**************");
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [alignment, setAlignment] = React.useState("web");

  const handleChangeToo = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/assessments");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient()
      .then(() => {})
      .finally(() => {
        getAssessmentsAndUsers()
          .then(() => {})
          .finally(() => {});
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, user]);

  return (
    <>
      <MainCard radius="0.4rem" padding={false}>
        <Stack
          marginY={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          paddingX={{ lg: 10, xl: 20 }}
        >
          {loading ? (
            <>Cargando...</>
          ) : (
            <>
              {user?.idRole === "2" && (
                <Stack width="375px">
                  <FormInputAutocomplete
                    control={control}
                    id="select-user-audit"
                    name="selectUsers"
                    searchIcon={true}
                    label="Selecciona un usuario"
                    onChange={async (e: any) => {
                      await getAudits(e.value);
                    }}
                    options={optionsUsers}
                    freeSolo
                    newValues
                    forcePopupIcon
                    getOptionLabel={(option) => option.label}
                    renderOption={(option) => <>{option.label}</>}
                  />
                </Stack>
              )}
              <Stack width="375px">
                <FormInputAutocomplete
                  control={control}
                  id="select-audit-by-role"
                  name="selectAudit"
                  disabled={optionsAudits.length === 0}
                  searchIcon={true}
                  label="Selecciona una auditoría"
                  onChange={async (e: any) => {
                    await getAssessment(e.value);
                  }}
                  options={optionsAudits}
                  freeSolo
                  newValues
                  forcePopupIcon
                  getOptionLabel={(option) => option.label}
                  renderOption={(option) => <>{option.label}</>}
                />
              </Stack>
            </>
          )}
        </Stack>
      </MainCard>
      <Box height={10} />
      <Grid container minHeight="75vh" spacing={2}>
        <Grid item xs={4}>
          <MainCard radius="0.4rem" padding={false} height="100%">
            <Stack padding={2}>
              <Typography variant="h4">Evaluación de controles</Typography>
              <Box height={10} />
              <FormInputAutocomplete
                control={control}
                InputProps={{
                  placeholder: "Busca un grupo...",
                }}
                searchIcon={true}
                id="search-control-group"
                options={optionsGroup}
                name="searchControlGroup"
                label=""
                freeSolo
                newValues
                forcePopupIcon
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <>{option.label}</>}
              />
            </Stack>
            <Box height={5} />
            <Divider />
            <Box height={10} />

            <Stack alignItems="end" spacing={1} overflow="auto">
              {dataControls.map((elem) => (
                <Box
                  sx={{
                    position: "relative",
                    borderLeft: 2,
                    borderTop: 2,
                    borderBottom: 2,
                    borderColor:
                      elem.id === selectedGroupControl
                        ? theme.palette.divider
                        : `${theme.palette.divider}60`,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    "&:hover": {
                      cursor: "pointer",
                      borderColor: theme.palette.divider,
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "100px",
                        backgroundColor: theme.palette.background.paper,
                      },
                    },
                  }}
                  width="95%"
                  padding={1}
                  key={`data-control-group-${elem.id}`}
                  onClick={() => setSelectedGroupControl(elem.id)}
                >
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {elem.groupCode}
                    </Typography>
                    <Typography variant="subtitle2">{elem.group}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={8}>
          <Box height={10} />
          <Typography variant="h4">Registro de Auditoría</Typography>
          <Box height={10} />

          <Grid container spacing={2} alignItems="end">
            <Grid item xs={10}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  scrollButtons
                  allowScrollButtonsMobile
                >
                  {versionData.map((elem) => (
                    <Tab
                      key={`history-audit-tab-${elem.id}`}
                      label={elem.nombre}
                      id={`history-audit-tab-${elem.id}`}
                      aria-controls={`history-audit-tab-${elem.id}`}
                      value={elem.id}
                    />
                  ))}
                </Tabs>
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" startIcon={<Plus />}>
                Nuevo
              </Button>
            </Grid>
          </Grid>

          {versionData.map((elem) => (
            <CustomTabPanel
              value={value}
              index={elem.id}
              key={`content-tab-audit-${elem.id}`}
            >
              <MainCard radius="0.5rem" padding={false}>
                <Box padding={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <ToggleButtonGroup
                      color="primary"
                      value={alignment}
                      exclusive
                      onChange={handleChangeToggleButton}
                      aria-label="Platform"
                    >
                      {ArrayFilterCustomTab.map((elem) => (
                        <ToggleButton
                          sx={{ paddingX: 2, paddingY: 0.6 }}
                          key={`toggle-button-${elem.id}-${elem.type}`}
                          value={elem.type}
                        >
                          {elem.value}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    <Stack
                      direction="row"
                      padding={1}
                      border={1}
                      borderRadius={1}
                      borderColor={theme.palette.secondary.main}
                      bgcolor={`${theme.palette.secondary.light}80`}
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography>Nivel de Aceptación</Typography>
                      <Typography variant="h5">3</Typography>
                    </Stack>
                  </Stack>
                  <Box height={10} />
                  <Stack direction="row" justifyContent="space-between">
                    <Stack>
                      <Typography>Fecha de Inicio: 2024-05-12</Typography>
                      <Typography>Fecha conclusión: 2024-05-12</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      padding={1}
                      spacing={1}
                      alignItems="center"
                    >
                      <Stack>
                        <Typography>Ivan Fernandez</Typography>
                        <Typography>Auditor</Typography>
                      </Stack>
                      <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Default_avatar_profile.jpg/600px-Default_avatar_profile.jpg?20231202140256" />
                    </Stack>
                  </Stack>
                </Box>
              </MainCard>
            </CustomTabPanel>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingY={3}>{children}</Box>}
    </div>
  );
}

export default AssessmentsPageClient;
