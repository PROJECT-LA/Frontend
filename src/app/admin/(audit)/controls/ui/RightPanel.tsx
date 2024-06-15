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
  Button,
} from "@mui/material";
import { Panel } from "react-resizable-panels";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CUControlGroupType } from "../types";
import { PermissionTypes } from "@/utils/permissions";
import { ActionsButton, IconTooltip } from "@/components/buttons";
import { Pencil, Trash2Icon, ToggleRight, Check } from "lucide-react";
import { styled } from "@mui/material/styles";

const TruncatedTypography = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitLineClamp: 3,
  lineClamp: 3,
}));

interface RightPanel {
  permissions: PermissionTypes;
  editionControlGroup: CUControlGroupType | undefined;
}

export const RightPanel = ({
  editionControlGroup,
  permissions,
}: RightPanel) => {
  const theme = useTheme();
  return (
    <Panel minSize={60}>
      <Stack>
        {editionControlGroup !== undefined && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              borderBottom={1}
              alignItems="center"
              padding={2}
              borderColor={theme.palette.divider}
            >
              <Typography variant="h4">Control de accesos</Typography>
              <Stack direction="row" alignItems="center">
                {permissions.update && (
                  <IconTooltip
                    id={`edit-sub-control-group-${editionControlGroup.id}`}
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
                    id={`change-status-control-group-${editionControlGroup.id}`}
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
                    id={`delete-control-group-${editionControlGroup.id}`}
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
            <Grid container spacing={1}>
              <Grid item xs={5.5} height="7.5rem">
                <Stack padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Grupo
                  </Typography>
                  <Box height={5} />
                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4">
                      {editionControlGroup?.groupCode}
                    </Typography>
                    <Typography>{editionControlGroup?.group}</Typography>
                  </Stack>
                  <TruncatedTypography variant="subtitle2">
                    {editionControlGroup?.groupDescription}
                  </TruncatedTypography>
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

              <Grid item xs={6} height="7.5rem">
                <Stack padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Objetivo
                  </Typography>
                  <Box height={5} />

                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4">
                      {editionControlGroup.objectiveCode}
                    </Typography>
                    <Typography>{editionControlGroup?.objective}</Typography>
                  </Stack>
                  <TruncatedTypography variant="subtitle2">
                    {editionControlGroup?.objectiveDescription}
                  </TruncatedTypography>
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
            <Box height="100%">
              <Stack
                sx={{ padding: "1.2rem", overflowY: "auto" }}
                spacing={2.5}
              >
                {editionControlGroup?.controls?.map((specific, index) => (
                  <MainCard
                    padding={false}
                    key={`list-control-specific-${index}`}
                    radius="0.5rem"
                  >
                    <Stack padding="1.4rem">
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h4">{specific.name}</Typography>
                        <Typography variant="h5">{specific.code}</Typography>
                      </Stack>

                      <Box height={5} />
                      <Typography>{specific.description}</Typography>

                      <Box height={20} />

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1}>
                          {permissions.update && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              startIcon={<Pencil />}
                              onClick={() => {}}
                            >
                              Editar
                            </Button>
                          )}

                          {permissions.update && (
                            <Button
                              variant="outlined"
                              color="info"
                              startIcon={<Check />}
                              onClick={() => {}}
                            >
                              Activado
                            </Button>
                          )}
                        </Stack>

                        {permissions.delete && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {}}
                            startIcon={<Trash2Icon />}
                          >
                            Eliminar
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </MainCard>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>
    </Panel>
  );
};
