import {
  Box,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { CONSTANTS } from "../../../../../../config";
import { useForm } from "react-hook-form";
import { FormInputAutocomplete } from "@/components/forms";
import { optionType } from "@/components/forms/FormInputDropdown";
import { PermissionTypes } from "@/utils/permissions";
import { ArrayFilterCustomTab, AuditData } from "../types";
import { useSession } from "@/hooks/useSession";
import { MessagesInterpreter, delay } from "@/utils";
import { toast } from "sonner";
import { CustomTabSkeleton } from "./Skeletons";
import { LevelData } from "../../levels/types";
import { TemplatesData } from "../../templates/types";
import { Pagination } from "@/components/datatable";
import { SortTypeCriteria } from "@/types";
import { IconTooltip, OwnIconButton } from "@/components/buttons";
import {
  CirclePlus,
  Edit,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { CustomMessageState } from "@/components/states";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";

interface CustomTabAudit {
  permissions: PermissionTypes;
  idUser: string;
}

const CustomTabAudit = ({ permissions, idUser }: CustomTabAudit) => {
  const { sessionRequest } = useSession();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("md"));
  const [options, setOptions] = useState<Array<optionType>>([]);
  const { control } = useForm<{ searchAudit: string }>({
    defaultValues: {
      searchAudit: "",
    },
  });
  const [loading, setLoading] = useState(true);

  const [levelsData, setLevelsData] = useState<LevelData[]>([]);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);
  const [auditData, setAuditData] = useState<AuditData[]>([]);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "objective", name: "Objetivo" },
    { field: "template", name: "Plantilla" },
    { field: "description", name: "Descripción" },
    { field: "beginDate", name: "Fecha inicio" },
    { field: "finalDate", name: "Fecha fin" },
    { field: "level", name: "Nivel" },
    { field: "acceptanceLevel", name: "Aceptación" },

    { field: "estado", name: "Estado" },
    { field: "acciones", name: "Acciones" },
  ]);
  const tableContent: Array<Array<ReactNode>> = auditData.map(
    (audit, index) => [
      <Typography key={`objective-${audit.id}-${index}`} variant={"body2"}>
        {`${audit.objective}`}
      </Typography>,

      <Typography key={`template-${audit.id}-${index}`} variant={"body2"}>
        {templatesData.find((elem) => elem.id === audit.idTemplate)?.name}
      </Typography>,

      <Typography
        key={`description-${audit.id}-${index}`}
        variant={"body2"}
      >{`${audit.description}`}</Typography>,

      <Typography key={`initial-date-${audit.id}-${index}`} variant={"body2"}>
        {audit.beginDate}
      </Typography>,

      <Typography key={`final-date-${audit.id}-${index}`} variant={"body2"}>
        {audit.finalDate}
      </Typography>,

      <Typography key={`level-${audit.id}-${index}`} variant={"body2"}>
        {levelsData.find((elem) => elem.id === audit.idLevel)?.level}
      </Typography>,

      <Typography
        key={`acceptance-level-${audit.id}-${index}`}
        variant={"body2"}
      >
        {audit.acceptanceLevel}
      </Typography>,

      <CustomMessageState
        key={`status-${audit.id}-${index}`}
        title={audit.status}
        description={audit.status}
        color={
          audit.status == "ACTIVO"
            ? "success"
            : audit.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,

      <Grid
        container
        key={`${audit.id}-${index}-acciones`}
        justifyContent="flex-end"
        spacing={1}
      >
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoParametro-${audit.id}`}
            title={audit.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={audit.status == "ACTIVO" ? "success" : "error"}
            action={async () => {
              // await editarEstadoParametroModal(levelData);
            }}
            deactivate={audit.status == "PENDIENTE"}
            icon={audit.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />}
            name={
              audit.status == "ACTIVO"
                ? "Inactivar auditoría"
                : "Activar auditoría"
            }
          />
        )}

        {permissions.update && (
          <IconTooltip
            id={`edit-audit-${audit.id}`}
            name={"Auditoría"}
            title={"Editar"}
            color={"secondary"}
            action={() => {}}
            icon={<Edit />}
          />
        )}
        {permissions.delete && (
          <IconTooltip
            id={`delete-audit-${index}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              // deleteLevelModal(levelData);
            }}
            icon={<Trash2 />}
            name={"Eliminar nivel"}
          />
        )}
      </Grid>,
    ]
  );

  const getAuditsRequest = async () => {
    try {
      setLoading(true);
      await delay(100);
      const res1 = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/templates`,
        params: {
          page: 1,
          limit: 30,
        },
      });
      setTemplatesData(res1.data?.rows);
      await delay(100);
      const res2 = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/levels`,
        params: {
          page: 1,
          limit: 30,
        },
      });
      console.log("LEVELS");
      console.log(res2.data?.rows);
      console.log("LEVELS");

      setLevelsData(res2.data?.rows);
      await delay(100);
      const res3 = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/audits`,
      });
      await delay(100);
      console.log(res3.data.rows);
      setAuditData(res3.data?.rows);
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    getAuditsRequest().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <CustomTabSkeleton />
      ) : (
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={3} alignItems="end">
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                {ArrayFilterCustomTab.map((elem) => (
                  <ToggleButton
                    defaultChecked={elem.type === "ACTIVE"}
                    sx={{ paddingX: 2, paddingY: 0.6 }}
                    key={`toggle-button-${elem.id}-${elem.type}`}
                    value={elem.type}
                  >
                    {elem.value}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Box width="300px">
                <FormInputAutocomplete
                  control={control}
                  InputProps={{
                    placeholder: "Busca auditoría...",
                  }}
                  bgcolor={theme.palette.background.paper}
                  id="searchAudit"
                  name="searchAudit"
                  searchIcon={true}
                  options={options}
                  label=""
                  freeSolo
                  newValues
                  forcePopupIcon
                  getOptionLabel={(option) => option.label}
                  renderOption={(option) => <>{option.label}</>}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center">
              <IconTooltip
                id={"actualizarAuditoria"}
                title={"Actualizar"}
                key={`accionActualizarAuditoria`}
                action={async () => {
                  // await getLevelsRequest();
                }}
                icon={<RotateCcw />}
                name={"Actualizar lista de auditorías"}
              />
              {permissions.create && (
                <OwnIconButton
                  id={"agregarAuditoria"}
                  key={"agregarAuditoria"}
                  text={"Agregar"}
                  alter={xs ? "icono" : "boton"}
                  icon={<CirclePlus />}
                  description={"Agregar auditoría"}
                  action={() => {
                    // addLevelModal();
                  }}
                />
              )}
            </Stack>
          </Stack>
          <Box height={20} />
          <CustomDataTable
            title="Auditorías"
            error={false}
            loading={loading}
            actions={[]}
            columns={orderCriteria}
            changeOrderCriteria={setOrderCriteria}
            pagination={
              <Pagination
                limit={limit}
                page={page}
                total={total}
                changePage={setPage}
                changeLimit={setLimit}
              />
            }
            tableContent={tableContent}
            filters={[]}
          />
        </Stack>
      )}
    </>
  );
};

export default CustomTabAudit;
