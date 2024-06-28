"use client";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { CONSTANTS } from "../../../../../config";
import { MessagesInterpreter, delay, siteName, titleCase } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { ModulesModalView, DragSection } from "./ui";
import { AlertDialog, CustomDialog } from "@/components/modals";
import {
  FrontendURL,
  RolModules,
  TabPanelProps,
  URLFrontendByRole,
} from "./types";
import { RolCRUDType } from "../users/types";
import { Item } from "@/types";

interface NewOrder {
  idRole: string;
  data: SendedItem[];
}
interface SendedItem {
  id: string;
  order: string;
  subModules?: SendedItem[];
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingY: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ModulesClient2 = () => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [showDeleteModule, setShowDeleteModule] = useState<boolean>(false);
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);
  const [orderListener, setOrderListener] = useState<boolean>(false);
  const [moduleEdition, setModuleEdition] = useState<Item | undefined | null>();
  const [modalModule, setModalModule] = useState<{
    state: boolean;
    isSection: boolean;
    idRole: string;
    idSection?: string;
    nameSection?: string;
    urls?: FrontendURL[] | undefined;
  }>({
    isSection: false,
    idRole: "",
    state: false,
  });
  const [roles, setRoles] = useState<RolCRUDType[]>([]);
  const [modules, setModules] = useState<RolModules[]>([]);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const { sessionRequest, getPermissions } = useSession();

  const [dataURLsByRole, setDataURLsByRole] = useState<URLFrontendByRole[]>([]);

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/modules");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient()
      .then(() => {
        getModulesRoles().finally(() => {});
      })
      .finally(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModulesRoles = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      const rolesTemporal: RolCRUDType[] = res.data.rows;
      setRoles(res.data.rows);

      const temporalModules: RolModules[] = [];
      const temporalURLs: URLFrontendByRole[] = [];

      for (const rol of rolesTemporal) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/modules/${rol.id}`,
        });
        const res2 = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/policies/${rol.id}/frontend`,
        });
        temporalModules.push({
          rolId: rol.id,
          rolName: rol.name,
          data: res.data,
        });
        temporalURLs.push({
          id: rol.id,
          data: res2.data,
        });
      }

      setModules(temporalModules);
      setDataURLsByRole(temporalURLs);
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const updateOrderModules = async (indexRole: number, rolId: string) => {
    try {
      setLoading(true);
      const updatedOrders: SendedItem[] = [];
      await delay(1000);

      modules[indexRole].data.map((section, indexSection) => {
        const updatedModules: SendedItem[] = [];
        if (section.subModule !== undefined) {
          section.subModule.map((module, indexModule) => {
            updatedModules.push({
              id: module.id,
              order: Number(indexModule + 1) + "",
            });
          });
        }
        updatedOrders.push({
          id: section.id,
          order: Number(indexSection + 1) + "",
          subModules: updatedModules,
        });
      });

      const sendOrder: NewOrder = {
        idRole: rolId,
        data: updatedOrders,
      };
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules/change/order`,
        type: "PATCH",
        body: sendOrder,
      });

      toast.success(MessagesInterpreter(res));
      await getModulesRoles();
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
      setOrderListener(false);
    }
  };

  const reorderSections = (idRole: number, e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      setOrderListener(true);
      setModules((_) => {
        const newRoles = [...modules];
        const newSections = newRoles[idRole].data;
        const oldIdx = newSections.findIndex(
          (section) => section.id === e.active.id
        );
        const newIdx = newSections.findIndex(
          (section) => section.id === e.over!.id
        );
        newRoles[idRole].data = arrayMove(newSections, oldIdx, newIdx);
        return newRoles;
      });
    }
  };

  const reorderSubModules = (
    idRole: number,
    sectionIndex: number,
    e: DragEndEvent
  ) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      setOrderListener(true);

      setModules((modules) => {
        const newRoles = [...modules];
        const newSections = newRoles[idRole].data;
        const newModules = newSections[sectionIndex].subModule!;

        const oldIdx = newModules.findIndex(
          (module) => module.id === e.active.id
        );
        const newIdx = newModules.findIndex(
          (module) => module.id === e.over!.id
        );
        newSections[sectionIndex].subModule = arrayMove(
          newModules,
          oldIdx,
          newIdx
        );
        newRoles[idRole].data = [...newSections];
        return newRoles;
      });
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const closeModalModule = async () => {
    setModalModule({
      isSection: false,
      idRole: "",
      state: false,
    });
    setModuleEdition(undefined);
  };

  const addModuleModal = async (
    isSection: boolean,
    idRole: string,
    idSection?: string,
    nameSection?: string
  ) => {
    const frontendRole = dataURLsByRole.find((elem) => elem.id === idRole);
    setModalModule({
      urls: frontendRole?.data,
      state: true,
      idRole,
      isSection,
      idSection,
      nameSection,
    });
  };

  const editModuleModal = async (
    module: Item,
    idRole: string,
    isSection: boolean,
    idSection?: string,
    nameSection?: string
  ) => {
    const frontendRole = dataURLsByRole.find((elem) => elem.id === idRole);
    setModalModule({
      urls: frontendRole?.data,
      isSection,
      idRole,
      state: true,
      idSection,
      nameSection,
    });
    setModuleEdition(module);
  };

  const acceptAlertModuleState = async () => {
    setShowAlertModuleState(false);
    if (moduleEdition !== null && moduleEdition !== undefined) {
      try {
        setLoading(true);
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/modules/${moduleEdition.id}/status`,
          type: "patch",
        });
        toast.success(MessagesInterpreter(res));
        await getModulesRoles();
      } catch (e) {
        toast.error(MessagesInterpreter(e));
      } finally {
        setLoading(false);
      }
    }
    setModuleEdition(null);
  };

  const cancelAlertModuleState = async () => {
    setShowAlertModuleState(false);
    setModuleEdition(null);
  };

  const changeStateModuleModal = async (module: Item, isSection: boolean) => {
    setModuleEdition(module);
    setShowAlertModuleState(true);
  };

  const deleteModule = async (module: Item, isSection: boolean) => {
    setShowDeleteModule(true);
    setModuleEdition(module);
  };

  const acceptDeleteModule = async () => {
    setShowDeleteModule(false);
    if (moduleEdition !== null && moduleEdition !== undefined) {
      try {
        setLoading(true);
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/modules/${moduleEdition.id}`,
          type: "delete",
        });
        toast.success(MessagesInterpreter(res));
        await getModulesRoles();
      } catch (e) {
        toast.error(MessagesInterpreter(e));
      } finally {
        setLoading(false);
      }
    }
    setModuleEdition(null);
  };
  const [tab, setTab] = useState<string>("1");

  const cancelDeleteModule = () => {
    setShowDeleteModule(false);
    setModuleEdition(undefined);
  };

  return (
    <>
      <title>{`Módulos - ${siteName()}`}</title>

      <AlertDialog
        isOpen={showAlertModuleState}
        title={"Alerta"}
        text={`¿Está seguro de ${
          moduleEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        } el módulo: ${titleCase(moduleEdition?.title ?? "")} ?`}
      >
        <Button onClick={cancelAlertModuleState}>Cancelar</Button>
        <Button onClick={acceptAlertModuleState}>Aceptar</Button>
      </AlertDialog>

      <AlertDialog
        isOpen={showDeleteModule}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el módulo "${titleCase(
          moduleEdition?.title ?? ""
        )}" de manera permanente ?`}
      >
        <Button onClick={cancelDeleteModule}>Cancelar</Button>
        <Button onClick={acceptDeleteModule}>Aceptar</Button>
      </AlertDialog>

      <CustomDialog
        isOpen={modalModule.state}
        handleClose={closeModalModule}
        title={
          moduleEdition?.id
            ? modalModule.isSection
              ? "Editar Sección"
              : "Editar Módulo"
            : modalModule?.isSection
            ? "Nueva Sección"
            : "Nuevo Módulo"
        }
      >
        <ModulesModalView
          isSection={modalModule.isSection}
          urls={modalModule.urls}
          idSection={modalModule.idSection}
          idRole={modalModule.idRole}
          nameSection={modalModule.nameSection}
          module={moduleEdition}
          correctAction={() => {
            closeModalModule().finally();
            getModulesRoles().finally(() => {});
          }}
          cancelAction={closeModalModule}
        />
      </CustomDialog>

      {loading ? (
        <List>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <ListItem key={`modules-list-skeleton-wait-${index}`}>
                <Skeleton width="100%" height="4rem" />
              </ListItem>
            ))}
        </List>
      ) : (
        <>
          <Box position="relative" marginTop={2}>
            {!loading && (
              <Box
                position="absolute"
                width="100%"
                borderBottom={1.5}
                bottom={0}
                borderColor={theme.palette.primary.main}
                zIndex={0}
              />
            )}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="audit page data"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                zIndex: 10,
              }}
            >
              {modules.map((elem, index) => (
                <Tab
                  key={`tab-content-roles-${index}`}
                  label={elem.rolName}
                  id={`simple-tab-${index}`}
                  aria-controls={`modules-by-role-tab-${index}`}
                  onClick={(e) => setTab(elem.rolId)}
                  sx={{
                    backgroundColor:
                      tab === elem.rolId
                        ? theme.palette.background.default
                        : "transparent",
                    position: "relative",
                    borderTop: tab === elem.rolId ? 1.5 : 0,
                    borderLeft: tab === elem.rolId ? 1.5 : 0,
                    borderRight: tab === elem.rolId ? 1.5 : 0,
                    borderTopLeftRadius: tab === elem.rolId ? 4 : 0,
                    borderTopRightRadius: tab === elem.rolId ? 4 : 0,
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {modules.map((elem, index) => (
            <CustomTabPanel
              key={`custom-roles-pane-${index}`}
              value={value}
              index={Number(index)}
            >
              <>
                <Stack
                  alignItems="center"
                  direction={mdUp ? "row" : "column"}
                  spacing={mdUp ? 0 : 3}
                  width="100%"
                  justifyContent="space-between"
                >
                  <Typography>{`Módulos para ${elem.rolName}`}</Typography>
                  <Stack direction="row" spacing={1}>
                    {permissions.update && (
                      <Button
                        onClick={() => {
                          if (orderListener)
                            updateOrderModules(index, elem.rolId);
                        }}
                        variant="contained"
                        disabled={!orderListener}
                        startIcon={<RefreshCcw size={18} />}
                      >
                        <Typography>Actualizar orden</Typography>
                      </Button>
                    )}
                    {permissions.create && (
                      <Button
                        onClick={() => {
                          addModuleModal(true, elem.rolId);
                        }}
                        variant="contained"
                        startIcon={<PlusCircle size={18} />}
                      >
                        <Typography>Nueva Sección</Typography>
                      </Button>
                    )}
                  </Stack>
                </Stack>

                <DndContext onDragEnd={(e) => reorderSections(index, e)}>
                  <Box marginTop={3} minHeight="80vh">
                    <Card
                      sx={{
                        padding: mdUp ? 4 : 1,
                        borderRadius: CONSTANTS.borderRadius,
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {modules[index].data.length === 0 ? (
                        <Typography>
                          No existen secciones o módulos para este rol
                        </Typography>
                      ) : (
                        <SortableContext
                          items={modules[index].data.map(
                            (section) => section.id
                          )}
                        >
                          <Stack
                            height="100%"
                            width="100%"
                            spacing={CONSTANTS.gridSpacing}
                          >
                            {modules[index].data.map(
                              (section, indexSection) => (
                                <DragSection
                                  indexRole={index}
                                  key={`section-${section.id}`}
                                  changeState={changeStateModuleModal}
                                  deleteModule={deleteModule}
                                  addModuleModal={addModuleModal}
                                  idRole={elem.rolId}
                                  section={section}
                                  permissions={permissions}
                                  sectionIndex={indexSection}
                                  reorderSubModules={reorderSubModules}
                                  editModule={editModuleModal}
                                />
                              )
                            )}
                          </Stack>
                        </SortableContext>
                      )}
                    </Card>
                  </Box>
                </DndContext>
              </>
            </CustomTabPanel>
          ))}
        </>
      )}
    </>
  );
};

export default ModulesClient2;
