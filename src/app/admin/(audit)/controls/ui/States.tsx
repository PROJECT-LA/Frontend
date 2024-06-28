import React from "react";
import {
  Stack,
  Typography,
  Grid,
  Box,
  Link,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PlusCircle, Group, FileSliders } from "lucide-react";
import { FormInputAutocomplete } from "@/components/forms";
import { useForm } from "react-hook-form";
import { ActionsButton } from "@/components/buttons";
import { PermissionTypes } from "@/utils/permissions";
import { optionType } from "@/components/forms/FormInputDropdown";

export const NoTemplate = () => {
  return (
    <Stack justifyContent="center" alignItems="center" height="70vh">
      <Typography variant="h5">No existen plantillas actualmente</Typography>
      <Box height={10} />
      <Typography>
        Crea una nueva plantilla antes, en la vista de plantillas
      </Typography>
      <Box height={20} />
      <Link href="/admin/plantillas">
        <Button
          type="button"
          startIcon={<PlusCircle size={15} />}
          variant="contained"
        >
          Plantillas
        </Button>
      </Link>
    </Stack>
  );
};

interface TemplateSelector {
  data: Array<optionType>;
  idControlGroup: string;
  actionGroup: () => void;
  actionControlSpecific: (groupId: string) => void;
  exists: boolean;
  permissions: PermissionTypes;
  idTemplate: string;
  setIdTemplate: (idTemplate: string) => void;
}
interface SearchTemplate {
  selectTemplate: string;
}
export const TemplateSelector = ({
  data,
  idTemplate,
  setIdTemplate,
  actionControlSpecific,
  idControlGroup,
  actionGroup,
  exists,
}: TemplateSelector) => {
  const theme = useTheme();

  const actions = [
    {
      id: "agregarGrupoControl",
      show: true,
      title: "Nuevo grupo",
      action: () => {
        actionGroup();
      },
      deactivate: false,
      icon: <Group size={16} />,
      name: "Nuevo grupo",
    },
    {
      id: "agregarControlEspecifico",
      show: true,
      title: "Nuevo control",
      action: () => {
        if (idControlGroup) actionControlSpecific(idControlGroup);
      },
      deactivate: false,
      icon: <FileSliders size={16} />,
      name: "Nuevo control",
    },
  ];

  const action = [
    {
      id: "agregarGrupoControl",
      show: true,
      title: "Nuevo grupo",
      action: () => {
        actionGroup();
      },
      deactivate: false,
      icon: <Group size={16} />,
      name: "Nuevo grupo",
    },
  ];
  const { control } = useForm<SearchTemplate>({
    defaultValues: {
      selectTemplate:
        idTemplate.length > 0
          ? data.find((elem) => elem.value === idTemplate)?.label
          : "",
    },
  });

  return (
    <Grid container>
      <Grid item xs={11} lg={6}>
        <Stack width="80%">
          <FormInputAutocomplete
            id="selectTemplate"
            name="selectTemplate"
            control={control}
            searchIcon={true}
            label="Seleccione una plantilla"
            onChange={async (e: any) => {
              if (e && e.value !== undefined) {
                await setIdTemplate(e.value);
              }
            }}
            options={data}
            freeSolo
            newValues
            bgcolor="background.paper"
            forcePopupIcon
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <>{option.label}</>}
          />
        </Stack>
      </Grid>
      <Grid item xs={1} lg={6}>
        <Stack
          direction="row"
          height="100%"
          justifyContent="end"
          alignItems="end"
          paddingBottom={0.5}
        >
          <ActionsButton
            id={"addControlOrGroup"}
            text={"Agregar"}
            deactivate={!exists}
            alter={"boton"}
            label={"Agregar nuevo control o grupo"}
            actions={idControlGroup.length > 0 ? actions : action}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};
