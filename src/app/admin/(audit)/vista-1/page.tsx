"use client";
import MainCard from "@/components/cards/MainCard";
import { FormInputAutocomplete } from "@/components/forms";
import { optionType } from "@/components/forms/FormInputDropdown";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  getAccordionDetailsUtilityClass,
  useTheme,
} from "@mui/material";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { dataVista1 } from "./types";
import { useForm } from "react-hook-form";
import { SortTypeCriteria } from "@/types";
import { CustomMessageState } from "@/components/states";
import { PermissionTypes } from "@/utils/permissions";
import { IconTooltip } from "@/components/buttons";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../config";
import { MessagesInterpreter } from "@/utils";
import { toast } from "sonner";
import { ControlGroupType } from "../controls/types";
import { CustomDialog } from "@/components/modals";

const DATA_AUDIT = [
  {
    id: 1,
    cantidad: 44,
    nombre: "Controles",
  },
  {
    id: 2,
    cantidad: 4,
    nombre: "Auditores",
  },
  {
    id: 3,
    cantidad: 9,
    nombre: "Documentos",
  },
];

const VistaPage = () => {
  const { sessionRequest } = useSession();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [optionsGroup, setOptionsGroup] = useState<Array<optionType>>([]);
  const { control } = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: "",
    },
  });

  const [permissions, setPermissions] = useState<PermissionTypes>({
    create: true,
    delete: true,
    read: true,
    update: true,
  });
  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "controlGroup", name: "Grupo de Control", sort: true },
    { field: "aprovedLevel", name: "Nivel de aprobación", sort: true },
    { field: "estado", name: "Estado", sort: true },
    { field: "acciones", name: "Acciones" },
  ]);

  const contenidoTabla: Array<Array<ReactNode>> = dataVista1.map(
    (viewData, indexLevel) => [
      <Typography
        key={`${viewData.id}-${indexLevel}-name`}
        variant={"body2"}
      >{`${viewData.groupId}`}</Typography>,
      <Typography
        key={`${viewData.id}-${indexLevel}-description`}
        variant={"body2"}
      >{`${viewData.aprovedLevel}`}</Typography>,
      <CustomMessageState
        key={`${viewData.id}-${indexLevel}-estado`}
        title={viewData.status}
        description={viewData.status}
        color={viewData.status == "OPEN" ? "success" : "info"}
      />,

      <Grid
        container
        key={`${viewData.id}-${indexLevel}-acciones`}
        justifyContent="flex-end"
        spacing={1}
      >
        {permissions.update && (
          <IconTooltip
            id={`editarParametros-${viewData.id}`}
            name={"Parámetros"}
            title={"Editar"}
            color={"primary"}
            action={() => {
              // editarParametroModal(viewData);
            }}
            icon={<Edit />}
          />
        )}
        {permissions.delete && (
          <IconTooltip
            id={`eliminar-nivel-${indexLevel}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              // deleteLevelModal(viewData);
            }}
            icon={<Trash2 />}
            name={"Eliminar nivel"}
          />
        )}
      </Grid>,
    ]
  );

  const getControlGroupRequest = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups`,
        params: {
          page: 1,
          limit: 30,
          idTemplate: 1,
        },
      });
      setDataControls(res.data.rows);
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // getControlGroupRequest()
    //   .then(() => {})
    //   .finally(() => {});
    // eslint-disable-next-line
  }, []);

  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      {!loading && (
        <CustomDialog
          isOpen={modal}
          handleClose={() => setModal(false)}
          title={"Nuevo control"}
        >
          <></>
        </CustomDialog>
      )}
      <Box height="85vh">
        <Grid container height="100%">
          <Grid
            item
            xs={3}
            height="100%"
            bgcolor={theme.palette.background.paper}
          >
            <Stack spacing={2} paddingX={1} paddingY={3}>
              <Typography variant="h2">Datos generales</Typography>
              {DATA_AUDIT.map((elem) => (
                <MainCard key={elem.id}>
                  <Typography variant="h4">{elem.cantidad}</Typography>
                  <Typography>{elem.nombre}</Typography>
                </MainCard>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={9} paddingLeft={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h3">Controles para auditoría</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box width="300px" height="100%">
                  <FormInputAutocomplete
                    control={control}
                    InputProps={{
                      placeholder: "Buscar...",
                    }}
                    id="search"
                    name="search"
                    bgcolor={theme.palette.background.paper}
                    searchIcon={true}
                    options={optionsGroup}
                    label=""
                    freeSolo
                    newValues
                    forcePopupIcon
                    getOptionLabel={(option) => option.label}
                    renderOption={(option) => <>{option.label}</>}
                  />
                </Box>
                <Button variant="contained" startIcon={<Plus />}>
                  Agregar
                </Button>
              </Stack>
            </Stack>

            <Box height={10} />
            <CustomDataTable
              columns={orderCriteria}
              tableContent={contenidoTabla}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default VistaPage;
