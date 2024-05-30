"use client";
import MainCard from "@/components/cards/MainCard";
import {
  GlobalPermissionsProps,
  PermissionTypes,
  initialPermissions,
} from "@/utils/permissions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  Grab,
  GripVertical,
  Info,
  ListCollapse,
  Pencil,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Trash2Icon,
} from "lucide-react";
import { IconTooltip } from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { Item } from "@/types";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { ModulesModalView, SkeletonModules } from "./ui";
import { Icono } from "@/components/Icono";
import { getIconLucide } from "@/types/icons";
import { CustomDialog } from "@/components/modals";
import { ModuleCRUDType } from "./types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ModulesClient2 = () => {
  const [moduleEdition, setModuleEdition] = useState<
    ModuleCRUDType | undefined | null
  >();
  const [modalModule, setModalModule] = useState<{
    state: boolean;
    isSection: boolean;
  }>({
    isSection: false,
    state: false,
  });
  const [roles, setRoles] = useState<RolCRUDType[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const { sessionRequest, getPermissions } = useSession();
  const theme = useTheme();


  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/modules");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRoles().then(
      getModules().finally(()=>{})
    ).finally(()=>{})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, setRoles]);

  const [modulesSection, setModulesSection] = useState<Item[]>([]);

  const getModules = async () => {
    try {
      setLoading(true);
      await delay(1000);
      for(const rol of roles){
      }
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules`,
      });

      setModulesSection(res.data);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      setLoading(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });

      console.log(res)
      setRoles(res.data);
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const reorderSections = (e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      setModulesSection((sections) => {
        const oldIdx = sections.findIndex(
          (section) => section.id === e.active.id
        );
        const newIdx = sections.findIndex(
          (section) => section.id === e.over!.id
        );
        return arrayMove(sections, oldIdx, newIdx);
      });
    }
  };

  const reorderSubModules = (sectionIndex: number, e: DragEndEvent) => {
    if (!e.over) return;
    if (e.active.id !== e.over.id) {
      setModulesSection((sections) => {
        const newSections = [...sections];
        const subModules = newSections[sectionIndex].subModule!;
        const oldIdx = subModules.findIndex(
          (subModule) => subModule.id === e.active.id
        );
        const newIdx = subModules.findIndex(
          (subModule) => subModule.id === e.over!.id
        );
        newSections[sectionIndex].subModule = arrayMove(
          subModules,
          oldIdx,
          newIdx
        );
        return newSections;
      });
    }
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const closeModalModule = async () => {
    setModalModule({
      isSection: false,
      state: false,
    });
    setModuleEdition(undefined);
  };

  const addModuleModal = (isSection: boolean) => {
    setModalModule({
      state: true,
      isSection,
    });
  };

  return (
    <>
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
          module={moduleEdition}
          isSection={modalModule.isSection}
          correctAction={() => {
            closeModalModule().finally();
            // getSectionsRequest().then(() => {
            //   getModulesRequest().finally();
            // });
          }}
          cancelAction={closeModalModule}
          sections={[]}
        />
      </CustomDialog>

      <title>{`Módulos - ${siteName()}`}</title>
      <>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="ADMINISTRADOR" {...a11yProps(0)} />
            <Tab label="GERENTE" {...a11yProps(1)} />
            <Tab label="AUDITOR" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </>

      <CustomTabPanel value={value} index={0}>
        <>
          <Stack
            alignItems="center"
            direction="row"
            width="100%"
            justifyContent="end"
          >
            {permissions.create && (
              <Button
                onClick={() => {
                  addModuleModal(false);
                }}
                variant="contained"
                startIcon={<PlusCircle size={18} />}
              >
                <Typography>Nueva Sección</Typography>
              </Button>
            )}
          </Stack>
          <>
            {loading && modulesSection.length === 0 ? (
              <SkeletonModules />
            ) : (
              <DndContext onDragEnd={reorderSections}>
                <Box marginTop={3} minHeight="80vh">
                  <Card
                    sx={{
                      padding: 4,
                      borderRadius: CONSTANTS.borderRadius,
                      height: "100%",
                    }}
                  >
                    <SortableContext
                      items={modulesSection.map((section) => section.id)}
                    >
                      <Stack height="100%" spacing={CONSTANTS.gridSpacing}>
                        {modulesSection.map((section, index) => (
                          <div key={`section-${section.id}`}>
                            <SectionItem
                              section={section}
                              permissions={permissions}
                              sectionIndex={index}
                              reorderSubModules={reorderSubModules}
                            />
                          </div>
                        ))}
                      </Stack>
                    </SortableContext>
                  </Card>
                </Box>
              </DndContext>
            )}
          </>
        </>
      </CustomTabPanel>
    </>
  );
};

interface ISectionItem {
  section: Item;
  permissions: PermissionTypes;
  sectionIndex: number;
  reorderSubModules: (sectionIndex: number, e: DragEndEvent) => void;
}

const SectionItem = ({
  section,
  permissions,
  sectionIndex,
  reorderSubModules,
}: ISectionItem) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  return (
    <DndContext onDragEnd={(e) => reorderSubModules(sectionIndex, e)}>
      <Box
        {...listeners}
        ref={setNodeRef}
        {...attributes}
        sx={{
          borderColor: theme.palette.divider,
          border: 1,
          width: "100%",
          height: "100%",
          marginBottom: 1,
          padding: 1,
          borderRadius: 2,
          transition: transition,
          transform: CSS.Transform.toString(transform),
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Stack width="100%">
          {/* <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <> */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                ":hover": {
                  cursor: "grab",
                },
                ":active": {
                  cursor: "grabbing",
                },
              }}
            >
              <IconButton>
                <GripVertical />
              </IconButton>
              <Chip label={section.order + ""} />
              <Typography>{section.title}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              {section.description && (
                <IconTooltip
                  title={section.description}
                  icon={<Info />}
                  action={() => {}}
                  color="info"
                  id=""
                  name=""
                />
              )}

              {permissions.update && (
                <IconTooltip
                  id={`editarSubModule-${section.id}`}
                  title={"Editar"}
                  color={"primary"}
                  action={() => {}}
                  icon={<Pencil />}
                  name={"Editar submódulo"}
                />
              )}

              {permissions.update && (
                <IconTooltip
                  id={`cambiarEstadoModulo-${section.id}`}
                  title={section.status == "ACTIVO" ? "Inactivar" : "Activar"}
                  color={section.status == "ACTIVO" ? "success" : "error"}
                  action={() => {
                    // changeStateModuleModal(
                    //   moduleData,
                    //   moduleData.module === null
                    // );
                  }}
                  deactivate={section.status == "PENDIENTE"}
                  icon={
                    section.status == "ACTIVO" ? (
                      <ToggleRight />
                    ) : (
                      <ToggleLeft />
                    )
                  }
                  name={
                    section.status == "ACTIVO"
                      ? "Inactivar Módulo"
                      : "Activar Módulo"
                  }
                />
              )}
              {permissions.delete && (
                <IconTooltip
                  id="Eliminar"
                  name="Eliminar"
                  title="Eliminar"
                  color="error"
                  action={() => {}}
                  icon={<Trash2Icon />}
                />
              )}
            </Stack>
          </Stack>
          <Divider color="red" />
          {/* </>
            </AccordionSummary>

            <AccordionDetails> */}
          <SortableContext
            items={section.subModule!.map((subModule) => subModule.id)}
          >
            <List>
              {section.subModule!.map((subModule, index) => (
                <SubModuleItem
                  key={`subModule-${subModule.id}`}
                  id={subModule.id}
                  module={subModule}
                  permissions={permissions}
                />
              ))}
            </List>
          </SortableContext>
          {/* </AccordionDetails>
          </Accordion> */}
          <Box width="100%" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={() => addModuleModal(false)}
              startIcon={<PlusCircle />}
            >
              Agregar módulo
            </Button>
          </Box>
        </Stack>
      </Box>
    </DndContext>
  );
};

interface ISubModuleItem {
  id: string;
  module: Item;
  permissions: PermissionTypes;
}

const SubModuleItem = ({ id, permissions, module }: ISubModuleItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        borderColor: "black",
        border: 1,
        marginBottom: 1,
        padding: 1,
        borderRadius: 2,
        transition: transition,
        transform: CSS.Transform.toString(transform),
        bgcolor: "background.paper",
        ":hover": {
          cursor: "grab",
          opacity: "80%",
        },
        ":active": {
          cursor: "grabbing",
        },
        boxShadow: 3,
      }}
    >
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton>
            <GripVertical />
          </IconButton>
          <Chip label={module.order} />
          {module.icon && <Icono>{getIconLucide(module.icon)}</Icono>}
          <Typography>{module.title}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          {module.description && (
            <IconTooltip
              title={module.description}
              icon={<Info />}
              action={() => {}}
              color="info"
              id=""
              name=""
            />
          )}

          {permissions.update && (
            <IconTooltip
              id={`editarSubModule-data-own-${module.id}`}
              title={"Editar"}
              color={"primary"}
              action={() => {}}
              icon={<Pencil />}
              name={"Editar submódulo"}
            />
          )}

          {permissions.update && (
            <IconTooltip
              id={`cambiarEstadoModulo-${module.id}`}
              title={module.status == "ACTIVO" ? "Inactivar" : "Activar"}
              color={module.status == "ACTIVO" ? "success" : "error"}
              action={() => {
                // changeStateModuleModal(
                //   moduleData,
                //   moduleData.module === null
                // );
              }}
              deactivate={module.status == "PENDIENTE"}
              icon={
                module.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
              }
              name={
                module.status == "ACTIVO"
                  ? "Inactivar Módulo"
                  : "Activar Módulo"
              }
            />
          )}
          {permissions.delete && (
            <IconTooltip
              id="Eliminar"
              name="Eliminar"
              title="Eliminar"
              color="error"
              action={() => {}}
              icon={<Trash2Icon />}
            />
          )}
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default ModulesClient2;
