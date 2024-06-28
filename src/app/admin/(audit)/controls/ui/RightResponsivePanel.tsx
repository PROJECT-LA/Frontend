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
  useMediaQuery,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from "@mui/material";
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
  ArrowLeftCircle,
} from "lucide-react";
import { styled } from "@mui/material/styles";
import noData from "@/assets/no hay datos.png";

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
  backToSelectGroup: (value: boolean) => void;
}

export const RightResponsivePanel = ({
  editionControlGroup,
  permissions,
  onEditControlGroup,
  onChangeState,
  onDeleteControlGroup,
  loading,
  onEditControlSpecific,
  onDeleteControlSpecific,
  onChangeStateControlSpecific,
  backToSelectGroup,
}: RightPanel) => {
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Stack position="relative">
      <Box position="absolute" top={1} left={1}>
        <IconButton color="primary" onClick={() => backToSelectGroup(false)}>
          <ArrowLeftCircle />
        </IconButton>
      </Box>

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
            <Stack justifyContent="center" height="600px" alignItems="center">
              <Image
                src={noData}
                height={250}
                width={230}
                alt="No data support impaget"
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
                <Grid item xs={1}>
                  <></>
                </Grid>
                <Grid
                  item
                  xs={9}
                  height="7.5rem"
                  borderRight={1}
                  borderColor={theme.palette.divider}
                >
                  <Stack paddingY={1} paddingLeft={3}>
                    <Stack>
                      <Typography variant="h4">Grupo</Typography>
                    </Stack>
                    <Box height={5} />

                    <Stack direction="row" spacing={1}>
                      <Typography variant="h5">
                        {editionControlGroup?.groupCode}
                      </Typography>
                      <Typography>{editionControlGroup?.group}</Typography>
                    </Stack>
                    <Box height={10} />
                    <Typography variant="h4">Objetivo</Typography>
                    <Box height={5} />

                    <Stack direction="row" spacing={1}>
                      <Typography variant="h5">
                        {editionControlGroup.objectiveCode}
                      </Typography>
                      <Typography>{editionControlGroup?.objective}</Typography>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid item xs={1} alignContent="center">
                  <Stack width="100%">
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
                <Stack sx={{ padding: "0.5rem" }} spacing={1}>
                  {editionControlGroup?.controls?.map((specific, index) => (
                    <MainCard
                      padding={false}
                      key={`list-control-specific-${index}`}
                      radius="0.5rem"
                    >
                      <Stack padding="1rem">
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="h6">{specific.name}</Typography>
                          <Typography variant="h5">{specific.code}</Typography>
                        </Stack>

                        <Box height={5} />
                        <Typography variant="subtitle2">
                          {specific.description}
                        </Typography>
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
                              startIcon={<Trash2Icon size={16} />}
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
        </>
      )}
    </Stack>
  );
};
