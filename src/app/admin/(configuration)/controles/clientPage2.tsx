"use client";
import MainCard from "@/components/cards/MainCard";
import { FormInputDropdown, FormInputText } from "@/components/forms";
import { MessagesInterpreter, siteName } from "@/utils";
import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowBigRightDash, ListIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TemplatesData } from "../plantillas/types";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import { LoadingControlsSkeleton } from "./ui";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ControlProps {
  idTemplate?: string;
  exists: boolean;
}

interface SimpleSearch {
  search: string;
  templateAutocomplete: string;
}

const dataGroupEspecific = [
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
];

const ControlsPage2 = ({ idTemplate, exists }: ControlProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { sessionRequest, getPermissions } = useSession();
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  const { control } = useForm<SimpleSearch>({
    defaultValues: {
      search: "",
      templateAutocomplete: "",
    },
  });

  const getTemplateRequest = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/templates`,
        params: {
          page: 1,
          limit: 30,
        },
      });
      setTemplatesData(res.data?.rows);
      setErrorData(null);
    } catch (e) {
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/controles");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient().finally(() => {
      if (!exists) {
        getTemplateRequest().finally(() => {});
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDropDownText = (e: SelectChangeEvent) => {
    if (e.target && e.target.value) {
      router.push(`/admin/controles?template=${e.target.value}`);
    }
  };

  return (
    <>
      <title>{`Controles - ${siteName()}`}</title>

      <>
        {loading ? (
          <LoadingControlsSkeleton />
        ) : (
          <>
            {!exists && (
              <Box marginBottom={3}>
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Stack justifyContent="center" height="100%">
                      <ListItem>
                        <ListItemIcon>
                          <ArrowBigRightDash />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography variant="h5">
                            Seleccione una plantilla
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FormInputDropdown
                      id="templateAutocomplete"
                      name="templateAutocomplete"
                      control={control}
                      label=""
                      onChange={(e) => onDropDownText(e)}
                      options={templatesData.map((elem) => ({
                        key: elem.id,
                        value: elem.id,
                        label: elem.name,
                      }))}
                      bgcolor="background.paper"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            <MainCard padding={false} radius="0.4rem">
              <PanelGroup direction="horizontal">
                <Panel defaultSize={33.33} minSize={20} maxSize={80}>
                  <Box
                    sx={{
                      height: "100%",
                      overflow: "hidden",
                      position: "relative",
                      borderRight: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Stack padding={1} height="5rem">
                      <FormInputText
                        disabled={!exists}
                        id="search"
                        name="search"
                        control={control}
                        label="Buscar"
                      />
                    </Stack>
                    <Divider />
                    <List>
                      {new Array(10).fill(null).map((_, index) => (
                        <ListItem key={`list-item-${index}`}>
                          <Button
                            disabled={!exists}
                            fullWidth
                            variant="outlined"
                          >
                            Ejemplo 1
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Panel>
                <PanelResizeHandle />
                <Panel minSize={60}>
                  <Stack>
                    <Stack
                      padding={2}
                      height="5rem"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h3">Controles</Typography>
                      <Stack direction="row">
                        <Button
                          disabled={!exists}
                          variant="contained"
                          startIcon={<PlusCircle />}
                        >
                          Añadir control
                        </Button>
                      </Stack>
                    </Stack>
                    <Divider />
                    <Stack padding={1} spacing={2}>
                      {dataGroupEspecific.length === 0 ? (
                        <Stack
                          justifyContent="center"
                          height="450px"
                          alignItems="center"
                        >
                          <Image
                            src="/images/support/no-data-2.png"
                            height={200}
                            width={300}
                            alt="No data support impaget"
                          />
                          <Typography>No hay datos que mostrar</Typography>
                          <Typography variant="subtitle2">
                            Por favor busque algún grupo de control.
                          </Typography>
                        </Stack>
                      ) : (
                        <>
                          <MainCard>ejemplo</MainCard>
                          <MainCard>ejemplo</MainCard>
                          <MainCard>ejemplo</MainCard>
                          <MainCard>ejemplo</MainCard>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </Panel>
              </PanelGroup>
            </MainCard>
          </>
        )}
      </>
    </>
  );
};

export default ControlsPage2;
