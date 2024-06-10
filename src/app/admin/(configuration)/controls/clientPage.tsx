"use client";
import MainCard from "@/components/cards/MainCard";
import {
  FormInputAutocomplete,
  FormInputDropdown,
  FormInputText,
} from "@/components/forms";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Divider,
  Grid,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowBigRightDash,
  ChevronRight,
  FileSliders,
  Group,
  ListIcon,
  PlusCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TemplatesData } from "../plantillas/types";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import {
  LoadingControlsSkeleton,
  ModalControlGroup,
  ModalControlSpecific,
} from "./ui";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ActionsButton } from "@/components/buttons";
import { optionType } from "@/components/forms/FormInputDropdown";
import {
  AddModalInfo,
  CUControlGroupType,
  CUControlSpecificType,
  ControlGroupType,
  initialAddModalInfo,
} from "./types";
import { CustomDialog } from "@/components/modals";

interface ControlProps {
  idTemplate?: string;
  exists: boolean;
}

interface SimpleSearch {
  search: string;
  templateAutocomplete: string;
}

const dataGroupEspecific = [
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
];

const ControlsPage = ({ idTemplate, exists }: ControlProps) => {
  const theme = useTheme();
  const router = useRouter();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);
  const [editionControlGroup, setEditionControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);

  const [editionControlSpecific, setEditionControlSpecific] = useState<
    CUControlSpecificType | undefined
  >(undefined);

  const [addModalInfo, setAddModalInfo] =
    useState<AddModalInfo>(initialAddModalInfo);
  const [optionsGroup, setOptionsGroup] = useState<Array<optionType>>([]);

  const { sessionRequest, getPermissions } = useSession();
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);
  const [actualTemplate, setActualTemplate] = useState<
    TemplatesData | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  const { control } = useForm<SimpleSearch>({
    defaultValues: {
      search: "",
      templateAutocomplete: "",
    },
  });

  const getTemplateRequest = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/templates`,
        params: {
          page: 1,
          limit: 30,
        },
      });
      const ActualTemplate: TemplatesData[] = res.data?.rows;
      setTemplatesData(res.data?.rows);
      if (idTemplate) {
        const actualTemplate: TemplatesData | undefined = ActualTemplate.find(
          (elem) => elem.id === idTemplate
        );
        setActualTemplate(actualTemplate);
      }
      await delay(100);

      await getGroupControlsAndSpecific();

      setErrorData(null);
    } catch (e) {
      setErrorData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const getGroupControlsAndSpecific = async () => {
    try {
      setLoading(true);
      await delay(200);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups`,
        params: {
          page: 1,
          limit: 30,
          idTemplate,
        },
      });
      setDataControls(res.data.rows);
      await delay(100);
    } catch (e) {
      setErrorData(e);
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/controles");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient().finally(() => {
      getTemplateRequest().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDropDownText = (e: SelectChangeEvent) => {
    if (e.target && e.target.value) {
      router.push(`/admin/controls?template=${e.target.value}`);
    }
  };

  const closeModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };

  const acceptModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    // TODO: Obtener los valores actualizados
    setAddModalInfo(initialAddModalInfo);
  };

  return (
    <>
      <title>{`Controles - ${siteName()}`}</title>
      <CustomDialog
        isOpen={addModalInfo.state}
        handleClose={() => setAddModalInfo(initialAddModalInfo)}
        title={addModalInfo.isGroup ? "Nuevo grupo" : "Nuevo control"}
      >
        {addModalInfo.isGroup ? (
          <ModalControlGroup
            data={editionControlGroup}
            cancelAction={closeModalControl}
            correctAction={acceptModalControl}
          />
        ) : (
          <ModalControlSpecific
            data={editionControlSpecific}
            cancelAction={closeModalControl}
            correctAction={acceptModalControl}
          />
        )}
      </CustomDialog>

      <>
        {loading ? (
          <LoadingControlsSkeleton />
        ) : (
          <>
            {templatesData.length === 0 ? (
              <Stack justifyContent="center" alignItems="center" height="70vh">
                <Typography variant="h5">
                  No existen plantillas actualmente
                </Typography>
                <Box height={10} />
                <Typography>
                  Crea una nueva plantilla antes, en la vista de plantillas
                </Typography>
                <Box height={20} />
                <Link href="/admin/plantillas">
                  <Button
                    type="button"
                    startIcon={<PlusCircle size={15} />}
                    variant="contained"
                  >
                    Plantillas
                  </Button>
                </Link>
              </Stack>
            ) : (
              <>
                {!exists && (
                  <Box marginBottom={3}>
                    <Grid container>
                      <Grid item xs={12} md={3}>
                        <Stack justifyContent="center" height="100%">
                          <ListItem>
                            <ListItemIcon>
                              <ArrowBigRightDash />
                            </ListItemIcon>
                            <ListItemText>
                              <Typography variant="h5">
                                Seleccione una plantilla
                              </Typography>
                            </ListItemText>
                          </ListItem>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <FormInputDropdown
                          id="templateAutocomplete"
                          name="templateAutocomplete"
                          control={control}
                          label=""
                          onChange={(e) => onDropDownText(e)}
                          options={templatesData.map((elem) => ({
                            key: elem.id,
                            value: elem.id,
                            label: elem.name,
                          }))}
                          bgcolor="background.paper"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {actualTemplate !== undefined && (
                    <Typography variant="h4">{`Plantilla: ${actualTemplate.name}`}</Typography>
                  )}

                  <Stack direction="row">
                    {idTemplate !== undefined && (
                      <ActionsButton
                        id={"addControlOrGroup"}
                        text={"Agregar"}
                        deactivate={!exists}
                        alter={xs ? "icono" : "boton"}
                        label={"Agregar nuevo control o grupo"}
                        actions={[
                          {
                            id: "agregarGrupoControl",
                            show: true,
                            title: "Nuevo grupo",
                            action: () => {
                              setAddModalInfo({
                                state: true,
                                isGroup: true,
                              });
                              setEditionControlGroup({
                                idTemplate,
                              });
                            },
                            deactivate: false,
                            icon: <Group size={16} />,
                            name: "Nuevo grupo",
                          },
                          {
                            id: "agregarControlEspecifico",
                            show: true,
                            title: "Nuevo control",
                            action: () => {
                              setAddModalInfo({
                                state: true,
                                isGroup: false,
                              });
                            },
                            deactivate: false,
                            icon: <FileSliders size={16} />,
                            name: "Nuevo control",
                          },
                        ]}
                      />
                    )}
                  </Stack>
                </Stack>
                <Box height={20} />
                <MainCard padding={false} radius="0.4rem">
                  <PanelGroup direction="horizontal">
                    <Panel defaultSize={33.33} minSize={20} maxSize={80}>
                      <Box
                        sx={{
                          height: "100%",
                          overflow: "hidden",
                          position: "relative",
                          borderRight: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Stack padding={2} height="6rem">
                          <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Grupo de controles
                          </Typography>
                          <Box height={5} />
                          <FormInputAutocomplete
                            control={control}
                            disabled={!exists}
                            InputProps={{
                              placeholder: "Busca un grupo...",
                            }}
                            id="search"
                            name="search"
                            options={optionsGroup}
                            label=""
                            freeSolo
                            newValues
                            forcePopupIcon
                            getOptionLabel={(option) => option.label}
                            renderOption={(option) => <>{option.label}</>}
                          />
                        </Stack>
                        <Divider />
                        <List>
                          {idTemplate !== undefined &&
                            dataControls.map((elem) => (
                              <ListItem
                                key={`group-controls-${elem.id}-${elem.groupCode}`}
                                onClick={() => {
                                  setEditionControlGroup({
                                    idTemplate,
                                    group: elem.group,
                                    groupCode: elem.groupCode,
                                    groupDescription: elem.groupDescription,
                                    id: elem.id,
                                    objective: elem.objective,
                                    objectiveCode: elem.objectiveCode,
                                    objectiveDescription:
                                      elem.objectiveDescription,
                                  });
                                }}
                              >
                                <Box
                                  width={"100%"}
                                  border={1}
                                  borderColor={`${theme.palette.primary.main}80`}
                                  paddingX={2}
                                  paddingY={1}
                                  borderRadius={1}
                                  sx={{
                                    cursor: "pointer",
                                    transition: "all .3s ease-in",
                                    "&:hover": {
                                      backgroundColor: `${theme.palette.primary.light}35`,
                                    },
                                  }}
                                >
                                  <Stack spacing={1}>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Typography variant="h5">
                                        {elem.groupCode}
                                      </Typography>
                                      <ChevronRight size={12} />
                                      <Typography>{elem.group}</Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel minSize={60}>
                      <Stack>
                        {editionControlGroup !== undefined && (
                          <>
                            <Grid container spacing={1}>
                              <Grid item xs={5.5}>
                                <Stack spacing={1} height="6rem" padding={1}>
                                  <Typography
                                    variant="h4"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Grupo
                                  </Typography>
                                  <Stack direction="row" spacing={1}>
                                    <Typography variant="h4">
                                      {editionControlGroup?.groupCode}
                                    </Typography>
                                    <Typography>
                                      {editionControlGroup?.group}
                                    </Typography>
                                  </Stack>
                                  <Typography variant="subtitle2">
                                    {editionControlGroup?.groupDescription}
                                  </Typography>
                                </Stack>
                              </Grid>

                              <Grid item xs={0.5}>
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  height="100%"
                                >
                                  <Divider orientation="vertical" />
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Stack spacing={1} height="6rem" padding={1}>
                                  <Typography
                                    variant="h4"
                                    sx={{ textAlign: "center" }}
                                  >
                                    Objetivo
                                  </Typography>

                                  <Stack direction="row" spacing={1}>
                                    <Typography variant="h5">
                                      {editionControlGroup.objectiveCode}
                                    </Typography>
                                    <Typography>
                                      {editionControlGroup?.objective}
                                    </Typography>
                                  </Stack>
                                  <Typography variant="subtitle2">
                                    {editionControlGroup?.objectiveDescription}
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                            <Divider />
                          </>
                        )}

                        <Stack spacing={2}>
                          {dataGroupEspecific.length === 0 ? (
                            <Stack
                              justifyContent="center"
                              height="450px"
                              alignItems="center"
                            >
                              <Image
                                src="/images/support/no-data-2.png"
                                height={125}
                                width={200}
                                alt="No data support impaget"
                              />
                              <Box height={10} />
                              <Typography>No hay datos que mostrar</Typography>
                              <Typography variant="subtitle2">
                                Por favor busque algún grupo de control.
                              </Typography>
                            </Stack>
                          ) : (
                            <>
                              <MainCard>ejemplo</MainCard>
                              <MainCard>ejemplo</MainCard>
                              <MainCard>ejemplo</MainCard>
                              <MainCard>ejemplo</MainCard>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </Panel>
                  </PanelGroup>
                </MainCard>
              </>
            )}
          </>
        )}
      </>
    </>
  );
};

export default ControlsPage;
