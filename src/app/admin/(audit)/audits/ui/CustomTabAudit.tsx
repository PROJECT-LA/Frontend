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
import { FormInputAutocomplete, FormInputText } from "@/components/forms";
import { optionType } from "@/components/forms/FormInputDropdown";
import { PermissionTypes } from "@/utils/permissions";
import {
  ArrayFilterCustomTab,
  AuditData,
  CUAudit,
  StatusCustomTab,
} from "../types";
import { useSession } from "@/hooks/useSession";
import { MessagesInterpreter, delay } from "@/utils";
import { toast } from "sonner";
import { LevelData } from "../../levels/types";
import { TemplatesData } from "../../templates/types";
import { Pagination } from "@/components/datatable";
import { SortTypeCriteria } from "@/types";
import { IconTooltip, OwnIconButton } from "@/components/buttons";
import { CirclePlus, Edit, RotateCcw, Trash2 } from "lucide-react";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import dayjs from "dayjs";
import { CustomDialog } from "@/components/modals";
import AuditModalView from "./ModalAudit";

interface CustomTabAudit {
  permissions: PermissionTypes;
  idUser: string;
}

const CustomTabAudit = ({ permissions, idUser }: CustomTabAudit) => {
  const { sessionRequest } = useSession();
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("md"));

  const [statusAudit, setStatusAudit] = useState<StatusCustomTab>("CREADO");

  const [optionsAudit, setOptionsAudit] = useState<Array<optionType>>([]);
  const [auditEdition, setAuditEdition] = useState<CUAudit | undefined>(
    undefined
  );
  const [modalAudit, setModalAudit] = useState<boolean>(false);

  const { control, watch } = useForm<{ searchAudit: string }>({
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

  const changeSearchAudit = watch("searchAudit");

  const [orderCriteria, setOrderCriteria] = useState<Array<SortTypeCriteria>>([
    { field: "objective", name: "Objetivo" },
    { field: "template", name: "Plantilla" },
    { field: "description", name: "Descripción" },
    { field: "beginDate", name: "Fecha inicio" },
    { field: "finalDate", name: "Fecha fin" },
    { field: "level", name: "Nivel" },
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
        {`${dayjs(audit.beginDate).format("D/M/YYYY")}`}
      </Typography>,

      <Typography key={`final-date-${audit.id}-${index}`} variant={"body2"}>
        {dayjs(audit.finalDate).format("D/M/YYYY")}
      </Typography>,

      <Typography key={`level-${audit.id}-${index}`} variant={"body2"}>
        {levelsData.find((elem) => elem.id === audit.idLevel)?.name}
      </Typography>,

      <Grid
        container
        key={`${audit.id}-${index}-acciones`}
        justifyContent="flex-end"
        spacing={1}
      >
        {permissions.update && (
          <IconTooltip
            id={`edit-audit-${audit.id}`}
            name={"Auditoría"}
            title={"Editar"}
            color={"secondary"}
            action={() => {
              setAuditEdition(audit);
              setModalAudit(true);
            }}
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
    console.log(statusAudit);
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
      setLevelsData(res2.data?.rows);
      await delay(100);
      let url = `${CONSTANTS.baseUrl}/audits?idClient=${idUser}&status=${statusAudit}`;
      if (changeSearchAudit.length > 0) {
        url += `&filter=${changeSearchAudit}`;
      }
      const res3 = await sessionRequest({
        url,
      });
      await delay(100);

      setTotal(res3.data?.total);
      setAuditData(res3.data?.rows);
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: StatusCustomTab
  ) => {
    setStatusAudit(newStatus);
  };

  useEffect(() => {
    getAuditsRequest().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModalAudit = () => {
    setAuditEdition(undefined);
    setModalAudit(false);
  };
  const acceptModalAudit = async () => {
    await getAuditsRequest();
    setAuditEdition(undefined);
    setModalAudit(false);
  };

  useEffect(() => {
    getAuditsRequest()
      .then(() => {})
      .finally(() => {});
    // eslint-disable-next-line
  }, [statusAudit, changeSearchAudit]);

  return (
    <>
      <CustomDialog
        isOpen={modalAudit}
        handleClose={closeModalAudit}
        maxWidth="lg"
        title={auditEdition ? "Editar auditoría" : "Nueva auditoría"}
      >
        <AuditModalView
          idClient={idUser}
          cancelAction={closeModalAudit}
          correctAction={acceptModalAudit}
          audit={auditEdition}
          levelsData={levelsData}
          templatesData={templatesData}
        />
      </CustomDialog>

      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Grid container>
            <Grid item xs={5} alignContent="end">
              <ToggleButtonGroup
                color="primary"
                value={statusAudit}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                {ArrayFilterCustomTab.map((elem) => (
                  <ToggleButton
                    sx={{ paddingX: 2, paddingY: 0.6 }}
                    key={`toggle-button-${elem.id}-${elem.type}`}
                    onClick={async (e) => {
                      setStatusAudit(elem.type);
                    }}
                    value={elem.type}
                  >
                    {elem.value}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={5}>
              <Box width="60%">
                <FormInputText
                  control={control}
                  InputProps={{
                    placeholder: "Buscar auditoría...",
                  }}
                  bgcolor={theme.palette.background.paper}
                  id="searchAudit"
                  name="searchAudit"
                  label=""
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="end"
              >
                <IconTooltip
                  id={"actualizarAuditoria"}
                  title={"Actualizar"}
                  key={`accionActualizarAuditoria`}
                  action={async () => {
                    await getAuditsRequest();
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
                      setModalAudit(true);
                    }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        <CustomDataTable
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
    </>
  );
};

export default CustomTabAudit;
