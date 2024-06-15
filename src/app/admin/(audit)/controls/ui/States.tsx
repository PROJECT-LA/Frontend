import React from "react";
import {
  Stack,
  Typography,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Link,
  Button,
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlusCircle,
  ArrowBigRightDash,
  Group,
  Pencil,
  ToggleRight,
  Trash2Icon,
  FileSliders,
} from "lucide-react";
import { FormInputDropdown } from "@/components/forms";
import { TemplatesData } from "../../plantillas/types";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ActionsButton } from "@/components/buttons";
import { PermissionTypes } from "@/utils/permissions";
import { IconTooltip } from "@/components/buttons";

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
  data: TemplatesData[];
}
interface SearchTemplate {
  selectTemplate: string;
}
export const TemplateSelector = ({ data }: TemplateSelector) => {
  const router = useRouter();
  const { control } = useForm<SearchTemplate>({
    defaultValues: {
      selectTemplate: "",
    },
  });

  const onDropDownText = (e: SelectChangeEvent) => {
    if (e.target && e.target.value) {
      router.push(`/admin/controls?template=${e.target.value}`);
    }
  };

  return (
    <Box marginBottom={3}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <Stack justifyContent="center" height="100%">
            <ListItem>
              <ListItemIcon>
                <ArrowBigRightDash />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h5">Seleccione una plantilla</Typography>
              </ListItemText>
            </ListItem>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <FormInputDropdown
            id="selectTemplate"
            name="selectTemplate"
            control={control}
            label=""
            onChange={(e) => onDropDownText(e)}
            options={data.map((elem) => ({
              key: elem.id,
              value: elem.id,
              label: elem.name,
            }))}
            bgcolor="background.paper"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

interface ControlsHeader {
  title: string;
  idControlGroup: string | undefined;
  actionGroup: () => void;
  actionControlSpecific: (groupId: string) => void;
  exists: boolean;
  permissions: PermissionTypes;
}

export const ControlsHeader = ({
  title,
  exists,
  actionControlSpecific,
  idControlGroup,
  permissions,
  actionGroup,
}: ControlsHeader) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

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

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h4">{`Plantilla: ${title}`}</Typography>

      <Stack direction="row" alignItems="center">
        {idControlGroup && permissions.update && (
          <IconTooltip
            id={`edit-sub-control-group-${idControlGroup}`}
            title={"Editar"}
            color={"primary"}
            action={() => {
              // editModule(section, idRole, true);
            }}
            icon={<Pencil />}
            name={"Editar control específico"}
          />
        )}

        {idControlGroup && permissions.update && (
          <IconTooltip
            id={`change-status-control-group-${idControlGroup}`}
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
        {idControlGroup && permissions.delete && (
          <IconTooltip
            id={`delete-control-group-${idControlGroup}`}
            name="Eliminar"
            title="Eliminar"
            color="error"
            action={() => {
              // deleteModule(section, true);
            }}
            icon={<Trash2Icon />}
          />
        )}
        <ActionsButton
          id={"addControlOrGroup"}
          text={"Agregar"}
          deactivate={!exists}
          alter={xs ? "icono" : "boton"}
          label={"Agregar nuevo control o grupo"}
          actions={idControlGroup ? actions : action}
        />
      </Stack>
    </Stack>
  );
};
