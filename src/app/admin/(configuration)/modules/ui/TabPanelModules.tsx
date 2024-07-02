"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { PermissionTypes } from "@/utils/permissions";
import { FrontendURL, RolModules, URLFrontendByRole } from "../types";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { CONSTANTS } from "../../../../../../config";
import { DragSection } from "./DragModules";
import { MessagesInterpreter, delay, titleCase } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { Item } from "@/types";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { ModulesModalView } from "./ModulesModal";

interface NewOrder {
  idRole: string;
  data: SendedItem[];
}
interface SendedItem {
  id: string;
  order: string;
  subModules?: SendedItem[];
}

interface TabPanelModules {
  index: number;
  permissions: PermissionTypes;
  rolId: string;
  rolName: string;
}

export const TabPanelModules = ({
  rolId,
  index,
  rolName,
  permissions,
}: TabPanelModules) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { sessionRequest } = useSession();
  const [loading, setLoading] = useState<boolean>(true);

  const [showDeleteModule, setShowDeleteModule] = useState<boolean>(false);
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);
  const [sections, setSections] = useState<any>();
  const [orderListener, setOrderListener] = useState<boolean>(false);

  const [module, setModule] = useState<RolModules | undefined>();
  const [moduleEdition, setModuleEdition] = useState<Item | undefined | null>();

  const [dataURLsByRole, setDataURLsByRole] = useState<
    URLFrontendByRole | undefined
  >();

  const addModuleModal = async (
    isSection: boolean,
    idRole: string,
    idSection?: string,
    nameSection?: string
  ) => {
    setModalModule({
      urls: dataURLsByRole?.data,
      state: true,
      idRole,
      isSection,
      idSection,
      nameSection,
    });
  };

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

  const editModuleModal = async (
    module: Item,
    idRole: string,
    isSection: boolean,
    idSection?: string,
    nameSection?: string
  ) => {
    setModalModule({
      urls: dataURLsByRole?.data,
      isSection,
      idRole,
      state: true,
      idSection,
      nameSection,
    });
    setModuleEdition(module);
  };

  const changeStateModuleModal = async (module: Item, isSection: boolean) => {
    setModuleEdition(module);
    setShowAlertModuleState(true);
  };

  const deleteModule = async (module: Item, isSection: boolean) => {
    setShowDeleteModule(true);
    setModuleEdition(module);
  };

  const getModuleRequest = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules/${rolId}`,
      });
      const res2 = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies/${rolId}/frontend`,
      });

      setModule({
        data: res.data,
        rolId,
        rolName,
      });
      setDataURLsByRole({
        id: rolId,
        data: res2.data,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getModuleRequest()
      .then(() => {})
      .finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrderModules = async (indexRole: number, rolId: string) => {
    try {
      setLoading(true);
      const updatedOrders: SendedItem[] = [];
      if (module)
        module.data.map((section, indexSection) => {
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
      await getModuleRequest();

      toast.success(MessagesInterpreter(res));
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
      setOrderListener(false);
    }
  };

  const reorderSubModules = (sectionIndex: number, e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      setOrderListener(true);
      const newSections = module?.data;
      if (newSections) {
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
        const newModule: RolModules = {
          data: newSections,
          rolId,
          rolName,
        };
        setModule(newModule);
      }
    }
  };

  const reorderSections = (e: DragEndEvent) => {
    if (!e.over) return;

    const newSections = module?.data;
    if (newSections && e.active.id !== e.over.id) {
      setOrderListener(true);
      const oldIdx = newSections?.findIndex(
        (section) => section.id === e.active.id
      );
      const newIdx = newSections?.findIndex(
        (section) => section.id === e.over!.id
      );
      const newModule: RolModules = {
        data: arrayMove(newSections, oldIdx, newIdx),
        rolId,
        rolName,
      };
      setModule(newModule);
    }
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
        await getModuleRequest();
      } catch (e) {
        toast.error(MessagesInterpreter(e));
      } finally {
        setLoading(false);
      }
    }
    setModuleEdition(null);
  };

  const cancelDeleteModule = () => {
    setShowDeleteModule(false);
    setModuleEdition(undefined);
  };
  const cancelAlertModuleState = async () => {
    setShowAlertModuleState(false);
    setModuleEdition(null);
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
        await getModuleRequest();
      } catch (e) {
        toast.error(MessagesInterpreter(e));
      } finally {
        setLoading(false);
      }
    }
    setModuleEdition(null);
  };
  const closeModalModule = async () => {
    setModalModule({
      isSection: false,
      idRole: "",
      state: false,
    });
    setModuleEdition(undefined);
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
          urls={modalModule.urls}
          idSection={modalModule.idSection}
          idRole={modalModule.idRole}
          nameSection={modalModule.nameSection}
          module={moduleEdition}
          correctAction={() => {
            closeModalModule().finally();
            getModuleRequest().finally(() => {});
          }}
          cancelAction={closeModalModule}
        />
      </CustomDialog>
      <Box
        borderLeft={1}
        borderRight={1}
        borderBottom={1}
        borderColor={theme.palette.primary.main}
        bgcolor={theme.palette.background.paper}
        minHeight="80vh"
        padding={2}
        sx={{
          borderBottomLeftRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
        }}
      >
        {!loading && module ? (
          <>
            <Stack
              alignItems="center"
              direction={mdUp ? "row" : "column"}
              spacing={mdUp ? 0 : 2}
              width="100%"
              justifyContent={mdUp ? "space-between" : "start"}
              alignContent={mdUp ? "center" : "start"}
            >
              <Typography>{`Módulos para ${module.rolName}`}</Typography>
              <Stack direction="row" spacing={1}>
                {permissions.update && (
                  <Button
                    onClick={() => {
                      if (orderListener)
                        updateOrderModules(index, module.rolId);
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
                      addModuleModal(true, module.rolId);
                    }}
                    variant="contained"
                    startIcon={<PlusCircle size={18} />}
                  >
                    <Typography>Nueva Sección</Typography>
                  </Button>
                )}
              </Stack>
            </Stack>
            <DndContext onDragEnd={(e) => reorderSections(e)}>
              <Box minHeight="80vh" marginTop={1}>
                <Card
                  sx={{
                    padding: mdUp ? 2 : 0.5,
                    borderRadius: CONSTANTS.borderRadius,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {module.data.length === 0 ? (
                    <Typography>
                      No existen secciones o módulos para este rol
                    </Typography>
                  ) : (
                    <SortableContext
                      items={module.data.map((section) => section.id)}
                    >
                      <Stack
                        height="100%"
                        width="100%"
                        spacing={CONSTANTS.gridSpacing}
                      >
                        {module.data.map((section, indexSection) => (
                          <DragSection
                            key={`section-${section.id}`}
                            changeState={changeStateModuleModal}
                            deleteModule={deleteModule}
                            addModuleModal={addModuleModal}
                            idRole={module.rolId}
                            section={section}
                            permissions={permissions}
                            sectionIndex={indexSection}
                            reorderSubModules={reorderSubModules}
                            editModule={editModuleModal}
                          />
                        ))}
                      </Stack>
                    </SortableContext>
                  )}
                </Card>
              </Box>
            </DndContext>
          </>
        ) : (
          <List>
            {Array(4)
              .fill(0)
              .map((elem, index) => (
                <ListItem
                  key={`new-loading-custom-module-tab-${rolId}-${index}`}
                >
                  <Skeleton width={"100%"} height={"5rem"} />
                </ListItem>
              ))}
          </List>
        )}
      </Box>
    </>
  );
};
