"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { PermissionTypes } from "@/utils/permissions";
import { RolModules } from "../types";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { CONSTANTS } from "../../../../../../config";
import { DragSection } from "./DragModules";

interface TabPanelModules {
  index: number;
  value: number;
  permissions: PermissionTypes;
  module: RolModules;
}

export const TabPanelModules = ({
  index,
  value,
  permissions,
  module,
}: TabPanelModules) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [sections, setSections] = useState<any>();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ paddingY: 3 }}>
          <Stack
            alignItems="center"
            direction={mdUp ? "row" : "column"}
            spacing={mdUp ? 0 : 3}
            width="100%"
            justifyContent="space-between"
          >
            <Typography>{`Módulos para ${module.rolName}`}</Typography>
            <Stack direction="row" spacing={1}>
              {permissions.update && (
                <Button
                  onClick={() => {
                    if (orderListener) updateOrderModules(index, module.rolId);
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
                          indexRole={index}
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
        </Box>
      )}
    </div>
  );
};
