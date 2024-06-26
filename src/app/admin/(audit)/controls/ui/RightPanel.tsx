import React from "react";
import {
  Stack,
  Grid,
  Typography,
  Divider,
  Box,
  useTheme,
  Button,
  Skeleton,
} from "@mui/material";
import { Panel } from "react-resizable-panels";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CUControlGroupType, ControlSpecificType } from "../types";
import { PermissionTypes } from "@/utils/permissions";
import { IconTooltip } from "@/components/buttons";
import {
  Pencil,
  Trash2Icon,
  ToggleRight,
  Check,
  ToggleLeft,
  X,
} from "lucide-react";
import { styled } from "@mui/material/styles";

const TruncatedTypography = styled(Typography)(() => ({
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
  onChangeState: () => void;
  onEditControlGroup: () => void;
  onDeleteControlGroup: () => void;
  loading: boolean;
  onEditControlSpecific: (editionSpecific: ControlSpecificType) => void;
  onDeleteControlSpecific: (editionSpecific: ControlSpecificType) => void;
  onChangeStateControlSpecific: (id: string) => void;
}

export const RightPanel = ({
  editionControlGroup,
  permissions,
  onEditControlGroup,
  onChangeState,
  onDeleteControlGroup,
  loading,
  onEditControlSpecific,
  onDeleteControlSpecific,
  onChangeStateControlSpecific,
}: RightPanel) => {
  const theme = useTheme();

  return (
    <Panel defaultSize={75} minSize={65}>
      <Stack>
        {editionControlGroup == undefined ? (
          <Stack justifyContent="center" height="600px" alignItems="center">
            <Image
              src="/images/support/no-data-hd.png"
              height={250}
              width={230}
              alt="No data support impaget"
            />
            <Box height={20} />
            <Typography variant="h4">No hay datos que mostrar</Typography>
            <Typography variant="caption">
              Por favor busque algún grupo de control.
            </Typography>
          </Stack>
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              borderBottom={1}
              alignItems="center"
              padding={2}
              borderColor={theme.palette.divider}
            >
              <>
                {loading ? (
                  <Typography variant="h4">Control de accesos</Typography>
                ) : (
                  <Skeleton />
                )}
              </>
              <>
                {loading ? (
                  <Skeleton />
                ) : (
                  <Stack direction="row" alignItems="center">
                    {permissions.update && (
                      <IconTooltip
                        id={`edit-sub-control-group-${editionControlGroup.id}`}
                        title={"Editar"}
                        color={"secondary"}
                        action={() => {
                          onEditControlGroup();
                        }}
                        icon={<Pencil />}
                        name={"Editar control específico"}
                      />
                    )}

                    {permissions.update && (
                      <IconTooltip
                        id={`change-status-control-group-${editionControlGroup.id}`}
                        title={
                          editionControlGroup.status === "ACTIVO"
                            ? "Inactivar"
                            : "Activar"
                        }
                        color={
                          editionControlGroup.status === "ACTIVO"
                            ? "success"
                            : "error"
                        }
                        action={() => {
                          onChangeState();
                        }}
                        icon={
                          editionControlGroup.status === "ACTIVO" ? (
                            <ToggleRight />
                          ) : (
                            <ToggleLeft />
                          )
                        }
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
                          onDeleteControlGroup();
                        }}
                        icon={<Trash2Icon />}
                      />
                    )}
                  </Stack>
                )}
              </>
            </Stack>
            <Grid container spacing={1}>
              <Grid item xs={5.7} height="7.5rem">
                <Stack paddingY={1} paddingLeft={3}>
                  <Stack>
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                      Grupo
                    </Typography>
                  </Stack>
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

              <Grid item xs={0.4}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Divider orientation="vertical" />
                </Box>
              </Grid>

              <Grid item xs={5.7} height="7.5rem">
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
            <Box
              height="550px"
              overflow="auto"
              bgcolor={theme.palette.background.default}
            >
              <Stack sx={{ padding: "1.2rem" }} spacing={2.5}>
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
                              onClick={() => {
                                onEditControlSpecific(specific);
                              }}
                            >
                              Editar
                            </Button>
                          )}

                          {permissions.update && (
                            <Button
                              variant="outlined"
                              color={
                                specific.status === "ACTIVO"
                                  ? "success"
                                  : "error"
                              }
                              startIcon={
                                specific.status === "ACTIVO" ? <Check /> : <X />
                              }
                              onClick={() => {
                                onChangeStateControlSpecific(specific.id);
                              }}
                            >
                              {specific.status === "ACTIVO"
                                ? "Activo"
                                : "Inactivo"}
                            </Button>
                          )}
                        </Stack>

                        {permissions.delete && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              onDeleteControlSpecific(specific);
                            }}
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
          </>
        )}
      </Stack>
    </Panel>
  );
};
