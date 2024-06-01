"use client";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import {
  Box,
  Button,
  Card,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { IconTooltip } from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { MessagesInterpreter, delay, siteName, titleCase } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { ModulesModalView, DragSection } from "./ui";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { ModuleCRUDType, RolModules, TabPanelProps } from "./types";
import { RolCRUDType } from "../users/types";
import { Item } from "@/types";

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ModulesClient2 = () => {
  const [showDeleteModule, setShowDeleteModule] = useState<boolean>(false);
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);
  const [moduleEdition, setModuleEdition] = useState<Item | undefined | null>();
  const [modalModule, setModalModule] = useState<{
    state: boolean;
    isSection: boolean;
    idRole: string;
    idSection?: string;
    nameSection?: string;
  }>({
    isSection: false,
    idRole: "",
    state: false,
  });
  const [roles, setRoles] = useState<RolCRUDType[]>([]);
  const [modules, setModules] = useState<RolModules[]>([]);
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const { sessionRequest, getPermissions } = useSession();

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/modules");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getModulesRoles().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModulesRoles = async () => {
    try {
      setLoading(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      const rolesTemporal: RolCRUDType[] = res.data.rows;
      setRoles(res.data.rows);

      const temporalModules: RolModules[] = [];

      for (const rol of rolesTemporal) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/modules/${rol.id}`,
        });
        temporalModules.push({
          rolId: rol.id,
          rolName: rol.name,
          data: res.data,
        });
      }

      setModules(temporalModules);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const reorderSections = (e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      // setModulesSection((sections) => {
      //   const oldIdx = sections.findIndex(
      //     (section) => section.id === e.active.id
      //   );
      //   const newIdx = sections.findIndex(
      //     (section) => section.id === e.over!.id
      //   );
      //   return arrayMove(sections, oldIdx, newIdx);
      // });
    }
  };

  const reorderSubModules = (sectionIndex: number, e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      // setModulesSection((sections) => {
      //   const newSections = [...sections];
      //   const subModules = newSections[sectionIndex].subModule!;
      //   const oldIdx = subModules.findIndex(
      //     (subModule) => subModule.id === e.active.id
      //   );
      //   const newIdx = subModules.findIndex(
      //     (subModule) => subModule.id === e.over!.id
      //   );
      //   newSections[sectionIndex].subModule = arrayMove(
      //     subModules,
      //     oldIdx,
      //     newIdx
      //   );
      //   return newSections;
      // });
    }
  };

  /******************************************** actions *****************************************/
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

  const addModuleModal = (
    isSection: boolean,
    idRole: string,
    idSection?: string,
    nameSection?: string
  ) => {
    console.log(idSection);
    console.log(nameSection);

    setModalModule({
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
    setModalModule({
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
        console.log(e);
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
        console.log(e);
        toast.error(MessagesInterpreter(e));
      } finally {
        setLoading(false);
      }
    }
    setModuleEdition(null);
  };

  const cancelDeleteModule = () => {
    setShowDeleteModule(false);
    setModuleEdition(null);
  };

  return (
    <>
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

      <title>{`Módulos - ${siteName()}`}</title>

      {!loading && roles.length > 0 && modules.length > 0 && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {modules.map((elem, index) => (
                <Tab
                  key={`tab-content-roles-${index}`}
                  label={elem.rolName}
                  id={`simple-tab-${index}`}
                  aria-controls={`simple-tabpanel-${index}`}
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
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Typography>{`Módulos para ${elem.rolName}`}</Typography>
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

                <DndContext onDragEnd={reorderSections}>
                  <Box marginTop={3} minHeight="80vh">
                    <Card
                      sx={{
                        padding: 4,
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
                                  key={`section-${section.id}`}
                                  changeState={changeStateModuleModal}
                                  deleteModule={deleteModule}
                                  addModuleModal={addModuleModal}
                                  idRole={elem.rolId}
                                  section={section}
                                  permissions={permissions}
                                  sectionIndex={index}
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
