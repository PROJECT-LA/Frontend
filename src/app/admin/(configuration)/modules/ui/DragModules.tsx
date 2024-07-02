"use client";
import { Icono } from "@/components/Icono";
import { IconTooltip } from "@/components/buttons";
import { Item } from "@/types";
import { PermissionTypes } from "@/utils/permissions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronDown,
  GripVertical,
  Info,
  Pencil,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Trash2Icon,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { getIconLucide } from "@/types/icons";
import { ModuleCRUDType } from "../types";
import { useState } from "react";

interface SectionProps {
  idRole: string;
  indexRole: number;
  section: Item;
  permissions: PermissionTypes;
  sectionIndex: number;
  reorderSubModules: (sectionIndex: number, e: DragEndEvent) => void;
  addModuleModal: (
    state: boolean,
    idRole: string,
    idSection?: string,
    nameSection?: string
  ) => void;
  changeState: (module: Item, isSection: boolean) => void;
  deleteModule: (modules: Item, isSection: boolean) => void;
  editModule: (
    module: Item,
    idRole: string,
    isSection: boolean,
    idSection?: string,
    nameSection?: string
  ) => void;
}

export const DragSection = ({
  section,
  indexRole,
  permissions,
  sectionIndex,
  reorderSubModules,
  addModuleModal,
  changeState,
  deleteModule,
  editModule,
  idRole,
}: SectionProps) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  return (
    <DndContext onDragEnd={(e) => reorderSubModules(sectionIndex, e)}>
      <Box
        ref={setNodeRef}
        sx={{
          zIndex: 1,
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
          <Accordion>
            <AccordionSummary
              expandIcon={
                <IconButton sx={{ border: 1 }}>
                  <ChevronDown />
                </IconButton>
              }
            >
              <Stack
                width="98%"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack
                  {...listeners}
                  {...attributes}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    flexGrow: 1,
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
                <Stack direction="row" spacing={1} sx={{ zIndex: 5 }}>
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
                      action={() => {
                        editModule(section, idRole, true);
                      }}
                      icon={<Pencil />}
                      name={"Editar submódulo"}
                    />
                  )}

                  {permissions.update && (
                    <IconTooltip
                      id={`cambiarEstadoModulo-${section.id}`}
                      title={
                        section.status == "ACTIVO" ? "Inactivar" : "Activar"
                      }
                      color={section.status == "ACTIVO" ? "success" : "error"}
                      action={() => {
                        changeState(section, true);
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
                      action={() => {
                        deleteModule(section, true);
                      }}
                      icon={<Trash2Icon />}
                    />
                  )}
                </Stack>
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <SortableContext
                items={section.subModule!.map((subModule) => subModule.id)}
              >
                <List>
                  {section.subModule!.map((subModule, index) => (
                    <Module
                      key={`subModule-${subModule.id}`}
                      id={subModule.id}
                      idRole={idRole}
                      module={subModule}
                      permissions={permissions}
                      changeState={changeState}
                      deleteModule={deleteModule}
                      editModule={editModule}
                      idSection={section.id}
                      nameSection={section.title ?? ""}
                    />
                  ))}
                </List>
              </SortableContext>
            </AccordionDetails>
          </Accordion>
          <Box
            width="100%"
            display="flex"
            marginBottom={2}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              onClick={() =>
                addModuleModal(false, idRole, section.id, section.title)
              }
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

interface ModuleProps {
  id: string;
  module: Item;
  permissions: PermissionTypes;
  changeState: (module: Item, isSection: boolean) => void;
  deleteModule: (modules: Item, isSection: boolean) => void;
  editModule: (
    module: Item,
    idRole: string,
    isSection: boolean,
    idSection?: string,
    nameSection?: string
  ) => void;
  idSection: string;
  nameSection: string;
  idRole: string;
}

const Module = ({
  id,
  idSection,
  idRole,
  nameSection,
  permissions,
  module,
  changeState,
  deleteModule,
  editModule,
}: ModuleProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <ListItem
      ref={setNodeRef}
      sx={{
        zIndex: 2,
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
        <Stack
          {...attributes}
          {...listeners}
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            flexGrow: 1,
          }}
        >
          <IconButton>
            <GripVertical />
          </IconButton>
          <Chip label={module.order} />
          {module.icon && <Icono>{getIconLucide(module.icon)}</Icono>}
          <Typography>{module.title}</Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ zIndex: 5 }}>
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
              action={() => {
                editModule(module, idRole, false, idSection, nameSection);
              }}
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
                changeState(module, false);
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
              action={() => {
                deleteModule(module, false);
              }}
              icon={<Trash2Icon />}
            />
          )}
        </Stack>
      </Stack>
    </ListItem>
  );
};
