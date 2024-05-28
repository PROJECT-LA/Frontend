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
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  Grab,
  GripVertical,
  ListCollapse,
  Pencil,
  PlusCircle,
  ToggleRight,
} from "lucide-react";
import { IconTooltip } from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { Item } from "@/types";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { SkeletonModules } from "./ui";

const ModulesClient2 = () => {
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
    getModules().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [modulesSection, setModulesSection] = useState<Item[]>([]);

  const getModules = async () => {
    try {
      setLoading(true);
      await delay(1000);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules`,
      });
      console.log("***********************************");
      console.log(res);
      console.log(res.data);
      console.log("***********************************");

      setModulesSection(res.data);
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
  return (
    <>
      <title>{`Módulos - ${siteName()}`}</title>
      <Stack
        alignItems="center"
        direction="row"
        width="100%"
        justifyContent="space-between"
      >
        <Typography variant="h4">Módulos</Typography>
        {permissions.create && (
          <Button variant="contained" startIcon={<PlusCircle size={18} />}>
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
              <Typography>
                {section.id} - {section.title}
              </Typography>
            </Stack>
            <IconTooltip
              id={`editarSubModule-${section.id}`}
              title={"Editar"}
              color={"primary"}
              action={() => {}}
              icon={<Pencil />}
              name={"Editar submódulo"}
            />
          </Stack>
          <Divider />
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
                >
                  {`${subModule.id} - ${subModule.title}`}
                </SubModuleItem>
              ))}
            </List>
          </SortableContext>
          {/* </AccordionDetails>
          </Accordion> */}
          <Box width="100%" display="flex" justifyContent="center">
            <Button variant="outlined" startIcon={<PlusCircle />}>
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
  children: any;
}

const SubModuleItem = ({ id, children }: ISubModuleItem) => {
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
        <Stack direction="row" alignItems="center">
          <IconButton>
            <GripVertical />
          </IconButton>
          {children}
        </Stack>
        <Stack>
          <IconTooltip
            id={`editarSubModule-${children}`}
            title={"Editar"}
            color={"primary"}
            action={() => {}}
            icon={<Pencil />}
            name={"Editar submódulo"}
          />
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default ModulesClient2;
