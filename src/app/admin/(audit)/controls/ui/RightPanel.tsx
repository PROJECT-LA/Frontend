import React from "react";
import {
  Stack,
  Grid,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  Card,
  useTheme,
} from "@mui/material";
import { Panel } from "react-resizable-panels";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CUControlGroupType } from "../types";
import { PermissionTypes } from "@/utils/permissions";
import { IconTooltip } from "@/components/buttons";
import { Pencil, Trash2Icon, ToggleRight } from "lucide-react";
interface RightPanel {
  permissions: PermissionTypes;
  editionControlGroup: CUControlGroupType | undefined;
}

export const RightPanel = ({
  editionControlGroup,
  permissions,
}: RightPanel) => {
  return (
    <Panel minSize={60}>
      <Stack>
        {editionControlGroup !== undefined && (
          <>
            <Grid container spacing={1}>
              <Grid item xs={5.5}>
                <Stack spacing={1} height="6.5rem" padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Grupo
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4">
                      {editionControlGroup?.groupCode}
                    </Typography>
                    <Typography>{editionControlGroup?.group}</Typography>
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
                <Stack spacing={1} height="7rem" padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Objetivo
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4">
                      {editionControlGroup.objectiveCode}
                    </Typography>
                    <Typography>{editionControlGroup?.objective}</Typography>
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
          {editionControlGroup?.controls?.length === 0 ? (
            <Stack justifyContent="center" height="450px" alignItems="center">
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
            <List sx={{ padding: "1rem", height: "100%", overflowY: "auto" }}>
              {editionControlGroup?.controls?.map((specific, index) => (
                <MainCard
                  padding={false}
                  key={`list-control-specific-${index}`}
                  radius="0.5rem"
                >
                  <Stack padding="0.8rem">
                    <Stack direction="row" justifyContent="space-between">
                      <Stack>
                        <Typography variant="h5">{specific.code}</Typography>
                        <Typography variant="h5">{specific.name}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        {permissions.update && (
                          <IconTooltip
                            id={`edit-sub-control-specific-${specific.code}`}
                            title={"Editar"}
                            color={"primary"}
                            action={() => {
                              // editModule(section, idRole, true);
                            }}
                            icon={<Pencil />}
                            name={"Editar control específico"}
                          />
                        )}

                        {permissions.update && (
                          <IconTooltip
                            id={`change-status-control-specific-${specific.code}`}
                            title={
                              // section.status == "ACTIVO" ? "Inactivar" : "Activar"
                              "Activar"
                            }
                            color={"success"}
                            action={() => {
                              // changeState(section, true);
                            }}
                            icon={<ToggleRight />}
                            name={"Activar control específico"}
                          />
                        )}
                        {permissions.delete && (
                          <IconTooltip
                            id="Eliminar"
                            name="Eliminar"
                            title="Eliminar"
                            color="error"
                            action={() => {
                              // deleteModule(section, true);
                            }}
                            icon={<Trash2Icon />}
                          />
                        )}
                      </Stack>
                    </Stack>

                    <Box height={5} />
                    <Typography>{specific.description}</Typography>
                  </Stack>
                </MainCard>
              ))}
            </List>
          )}
        </Stack>
      </Stack>
    </Panel>
  );
};
