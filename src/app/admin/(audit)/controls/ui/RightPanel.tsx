import React, { useState } from "react";
import {
  Stack,
  Grid,
  Typography,
  Divider,
  Box,
  useTheme,
  Button,
  Skeleton,
  useMediaQuery,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { Panel } from "react-resizable-panels";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CUControlGroupType, ControlSpecificType } from "../types";
import { PermissionTypes } from "@/utils/permissions";
import { IconTooltip, OwnIconButton } from "@/components/buttons";
import {
  Pencil,
  Trash2Icon,
  ToggleRight,
  Check,
  ToggleLeft,
  X,
  Eye,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import noData from "@/assets/no hay datos.png";
import { AlertDialog } from "@/components/modals";

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
  const [infoControlGroup, setInfoControlGroup] = useState<boolean>(false);

  const [editionControlSpecific, setEditionControlSpecific] = useState<
    ControlSpecificType | undefined
  >(undefined);

  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <>
      <AlertDialog
        isOpen={infoControlGroup}
        title="Información específica"
        text=""
      >
        <Stack spacing={2}>
          {editionControlSpecific !== undefined && (
            <Grid container>
              <Grid item xs={3}>
                <Typography variant="subtitle1">Código:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{editionControlSpecific.code}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1">Nombre:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{editionControlSpecific.name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1">Descripción:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{editionControlSpecific.description}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1">Estado:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>{editionControlSpecific.status}</Typography>
              </Grid>
            </Grid>
          )}
          <Box height={10} />
          <Stack width="100%" justifyContent="end">
            <Button
              onClick={() => {
                setInfoControlGroup(false);
                setEditionControlSpecific(undefined);
              }}
            >
              Cerrar
            </Button>
          </Stack>
        </Stack>
      </AlertDialog>
      <Panel defaultSize={75} minSize={65}>
        <Stack>
          {loading ? (
            <List>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <ListItem key={`right-panel-item-skeleton-${index}`}>
                    <Skeleton width="100%" height="4rem" />
                  </ListItem>
                ))}
            </List>
          ) : (
            <>
              {editionControlGroup == undefined ? (
                <Stack
                  justifyContent="center"
                  height="600px"
                  alignItems="center"
                >
                  <Image
                    src={noData}
                    height={250}
                    width={230}
                    alt="No data support image"
                  />
                  <Box height={20} />
                  <Typography variant="h4">No hay datos que mostrar</Typography>
                  <Typography variant="caption">
                    Por favor seleccione algún grupo de control.
                  </Typography>
                </Stack>
              ) : (
                <>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={5.7}
                      height="7.5rem"
                      borderRight={1}
                      borderColor={theme.palette.divider}
                    >
                      <Stack paddingY={1} paddingLeft={3}>
                        <Stack>
                          <Typography variant="h4" sx={{ textAlign: "center" }}>
                            Grupo
                          </Typography>
                        </Stack>
                        <Box height={5} />

                        <Stack direction="row" spacing={1}>
                          <Typography variant="h5">
                            {editionControlGroup?.groupCode}
                          </Typography>
                          <Typography>{editionControlGroup?.group}</Typography>
                        </Stack>
                        <TruncatedTypography variant="subtitle2">
                          {editionControlGroup?.groupDescription}
                        </TruncatedTypography>
                      </Stack>
                    </Grid>

                    <Grid
                      item
                      xs={5.7}
                      height="7.5rem"
                      borderRight={1}
                      borderColor={theme.palette.divider}
                    >
                      <Stack padding={1}>
                        <Typography variant="h4" sx={{ textAlign: "center" }}>
                          Objetivo
                        </Typography>
                        <Box height={5} />

                        <Stack direction="row" spacing={1}>
                          <Typography variant="h5">
                            {editionControlGroup.objectiveCode}
                          </Typography>
                          <Typography>
                            {editionControlGroup?.objective}
                          </Typography>
                        </Stack>
                        <TruncatedTypography variant="subtitle2">
                          {editionControlGroup?.objectiveDescription}
                        </TruncatedTypography>
                      </Stack>
                    </Grid>

                    <Grid item xs={0.6}>
                      <Stack alignItems="center">
                        {permissions.update && (
                          <IconTooltip
                            buttonSize="small"
                            id={`edit-sub-control-group-${editionControlGroup.id}`}
                            title={"Editar"}
                            color={"secondary"}
                            action={() => {
                              onEditControlGroup();
                            }}
                            icon={<Pencil size={18} />}
                            name={"Editar control específico"}
                          />
                        )}

                        {permissions.update && (
                          <IconTooltip
                            buttonSize="small"
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
                                <ToggleRight size={18} />
                              ) : (
                                <ToggleLeft size={18} />
                              )
                            }
                            name={"Activar control específico"}
                          />
                        )}
                        {permissions.delete && (
                          <IconTooltip
                            buttonSize="small"
                            id={`delete-control-group-${editionControlGroup.id}`}
                            name="Eliminar"
                            title="Eliminar"
                            color="error"
                            action={() => {
                              onDeleteControlGroup();
                            }}
                            icon={<Trash2Icon size={18} />}
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box
                    height={xlUp ? "calc(75vh * 0.84)" : "calc(75vh * 0.77)"}
                    overflow="auto"
                    bgcolor={theme.palette.background.default}
                  >
                    <Grid container spacing={1} padding={1}>
                      {editionControlGroup?.controls?.map((specific, index) => (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          xl={4}
                          key={`list-control-specific-${index}`}
                        >
                          <MainCard
                            padding={false}
                            radius="0.5rem"
                            border={false}
                            boxShadow={true}
                          >
                            <Stack padding="1rem">
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Typography variant="h5">
                                    {specific.code}
                                  </Typography>
                                  <Typography variant="h5" fontWeight={300}>
                                    {specific.name}
                                  </Typography>
                                </Stack>

                                <IconButton
                                  color="info"
                                  onClick={() => {
                                    setInfoControlGroup(true);
                                    setEditionControlSpecific({
                                      code: specific.code,
                                      description: specific.description,
                                      id: specific.id,
                                      name: specific.name,
                                      status: specific.status,
                                    });
                                  }}
                                >
                                  <Eye size={20} />
                                </IconButton>
                              </Stack>

                              <Box height={5} />
                              <Box height={60}>
                                <TruncatedTypography variant="subtitle2">
                                  {specific.description}
                                </TruncatedTypography>
                              </Box>

                              <Box height={10} />

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
                                      startIcon={<Pencil size={16} />}
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
                                        specific.status === "ACTIVO" ? (
                                          <Check size={16} />
                                        ) : (
                                          <X size={16} />
                                        )
                                      }
                                      onClick={() => {
                                        onChangeStateControlSpecific(
                                          specific.id
                                        );
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
                                    startIcon={<Trash2Icon size={16} />}
                                  >
                                    Eliminar
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </MainCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              )}
            </>
          )}
        </Stack>
      </Panel>
    </>
  );
};
