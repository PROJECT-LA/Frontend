"use client";
import {
  IconTooltip,
  OwnIconButton,
  SearchButton,
  SortButton,
} from "@/components/buttons";
import { CustomMessageState } from "@/components/states";
import { useSession } from "@/hooks/useSession";
import { SortTypeCriteria } from "@/types";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import {
  Button,
  Grid,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CirclePlus,
  Pencil,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import { CONSTANTS } from "../../../../../config";
import { MessagesInterpreter, titleCase } from "@/utils";
import { toast } from "sonner";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { ModalControlView } from "./ui";
import { ControlType } from "./types";

interface Controles {
  idTemplate: string;
}
const Controles = ({ idTemplate }: Controles) => {
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [controlsData, setControlsData] = useState<ControlType[]>();

  const [controlEdition, setControlEdition] = useState<any | undefined>();

  const [loading, setLoading] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<any>();

  /********************MODALS*****************************/
  const [alertStateControl, setAlertStateControl] = useState<boolean>(false);
  const [alertDeleteControl, setAlertDeleteControl] = useState<boolean>(false);
  const [modalControl, setModalControl] = useState<boolean>(false);
  /********************MODALS*****************************/

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sessionRequest, getPermissions } = useSession();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [ordenCriterios, setOrdenCriterios] = useState<Array<SortTypeCriteria>>(
    [
      { field: "oCodigo", name: "oCódigo", sort: true },
      { field: "oControl", name: "oControl", sort: true },
      { field: "oDescription", name: "oDescripción", sort: true },

      { field: "gCodigo", name: "gCódigo", sort: true },
      { field: "gControl", name: "gControl", sort: true },
      { field: "gDescription", name: "gDescripción", sort: true },

      { field: "eCodigo", name: "eCódigo", sort: true },
      { field: "eControl", name: "eControl", sort: true },
      { field: "eDescription", name: "eDescripción", sort: true },

      { field: "status", name: "Estado", sort: true },
      { field: "actions", name: "Acciones" },
    ]
  );

  const contenidoTabla: Array<Array<ReactNode>> =
    controlsData === undefined
      ? []
      : controlsData.map((control, indexTemplate) => [
          <Typography key={`${control.oControl}-${control.oControl}-code`}>
            {control.oControlCode}
          </Typography>,
          <Typography key={`${control.oControl}-${control.oControl}-control`}>
            {control.oControl}
          </Typography>,
          <Typography
            key={`${control.oControl}-${control.oControl}-description`}
          >
            {control.oControlDescription}
          </Typography>,

          <Typography key={`${control.gControl}-${control.gControl}-code`}>
            {control.gControlCode}
          </Typography>,
          <Typography key={`${control.gControl}-${control.gControl}-control`}>
            {control.gControl}
          </Typography>,
          <Typography
            key={`${control.gControl}-${control.gControl}-description`}
          >
            {control.gControlDescription}
          </Typography>,

          <Typography key={`${control.eControl}-${control.eControlCode}-code`}>
            {control.eControlCode}
          </Typography>,
          <Typography key={`${control.eControl}-${control.eControl}-control`}>
            {control.eControl}
          </Typography>,
          <Typography
            key={`${control.eControl}-${control.eControl}-description`}
          >
            {control.eControlDescription}
          </Typography>,

          <CustomMessageState
            key={`${control.oControl}-status`}
            title={control.status}
            description={control.status}
            color={
              control.status == "ACTIVO"
                ? "success"
                : control.status == "INACTIVO"
                ? "error"
                : "info"
            }
          />,

          <Grid key={`${control.oControl}-${indexTemplate}-actions`}>
            {permissions.update && (
              <IconTooltip
                id={`cambiarEstadoModulo-${control.oControl}`}
                title={control.status == "ACTIVO" ? "Inactivar" : "Activar"}
                color={control.status == "ACTIVO" ? "success" : "error"}
                action={() => {}}
                deactivate={control.status == "PENDIENTE"}
                icon={
                  control.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
                }
                name={
                  control.status == "ACTIVO"
                    ? "Inactivar Template"
                    : "Activar Template"
                }
              />
            )}

            {permissions.update && (
              <IconTooltip
                id={`editarPolitica-${indexTemplate}`}
                title={"Editar"}
                color={"primary"}
                action={() => {
                  // editarPoliticaModal(control);
                }}
                icon={<Pencil />}
                name={"Editar control"}
              />
            )}

            {permissions.delete && (
              <IconTooltip
                id={`eliminarPolitica-${indexTemplate}`}
                title={"Eliminar"}
                color={"error"}
                action={() => {
                  // deleteTemplateModal(control);
                }}
                icon={<Trash2 />}
                name={"Eliminar control"}
              />
            )}
          </Grid>,
        ]);

  const acciones: Array<ReactNode> = [
    <SearchButton
      id={"actionFilterPoliciesToggle"}
      key={"actionFilterPoliciesToggle"}
      selected={true}
      change={() => {}}
    />,
    xs && (
      <SortButton
        id={"sortTemplates"}
        key={`sortTemplates`}
        label={"Ordenar políticas"}
        criterios={ordenCriterios}
        cambioCriterios={setOrdenCriterios}
      />
    ),
    <IconTooltip
      id={"updateTemplate"}
      title={"Actualizar"}
      key={`actionUpdateTemplate`}
      action={async () => {
        await getControlsRequest();
      }}
      icon={<RotateCcw />}
      name={"Actualizar lista de templates"}
    />,
    permissions.create && (
      <OwnIconButton
        id={"addTemplate"}
        key={"addTemplate"}
        text={"Agregar"}
        alter={xs ? "icono" : "boton"}
        icon={<CirclePlus />}
        description={"Agregar template"}
        action={() => {
          addControlModal();
        }}
      />
    ),
  ];

  /*********************REQUEST*****************/
  const getControlsRequest = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/controls`,
        params: {
          page,
          limit,
          idTemplate,
        },
      });
      setControlsData(res.data?.rows);
      setTotal(res.data?.total);
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
    getPermissionsClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getControlsRequest().finally(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    limit,
    // filterApp,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(ordenCriterios),
    // filterPolicy,
  ]);

  /*********************REQUEST*****************/

  /*********************METHODS*****************/
  const addControlModal = () => {
    setModalControl(true);
  };
  const closeControlModal = () => {
    setModalControl(false);
  };

  const acceptAlertControlState = () => {
    setAlertStateControl(false);
  };
  const cancelAlertControlState = () => {
    setAlertStateControl(false);
  };

  const closeCreateEditControlModal = async () => {
    setControlEdition(undefined);
    setModalControl(false);
  };

  return (
    <>
      <AlertDialog
        isOpen={alertStateControl}
        title={"Alerta"}
        text={`¿Está seguro de ${
          controlEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        }  el template: ${titleCase(controlEdition?.name ?? "")} ?`}
      >
        <Button onClick={() => cancelAlertControlState()}>Cancelar</Button>
        <Button
          onClick={() => {
            acceptAlertControlState();
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <AlertDialog
        isOpen={alertDeleteControl}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el control ${controlEdition?.name} ?`}
      >
        <Button onClick={() => {}}>Cancelar</Button>
        <Button onClick={() => {}}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalControl}
        handleClose={closeControlModal}
        title={controlEdition ? "Editar control" : "Nuevo control"}
      >
        <ModalControlView
          idTemplate={idTemplate}
          controls={controlEdition}
          correctAction={() => {
            closeCreateEditControlModal().finally();
            getControlsRequest().finally();
          }}
          cancelAction={() => {
            closeCreateEditControlModal().finally();
          }}
        />
        {/* <TemplatesModalView
          template={templateEdition}
          correctAction={() => {
            closeCreateEditTemplateModal().finally();
            getTemplateRequest().finally();
          }}
          cancelAction={() => {
            closeCreateEditTemplateModal().finally();
          }}
        /> */}
      </CustomDialog>
      <CustomDataTable
        title={"Controles"}
        error={!!errorData}
        loading={loading}
        actions={acciones}
        columns={ordenCriterios}
        changeOrderCriteria={setOrdenCriterios}
        tableContent={contenidoTabla}
        pagination={
          <Pagination
            page={page}
            limit={limit}
            total={total}
            changePage={setPage}
            changeLimit={setLimit}
          />
        }
        // filters={
        //   showPolicyFilter && (
        //     <PoliticsFilter
        //       filterPolitic={filterPolicy}
        //       filterApp={filterApp}
        //       correctAction={(filter) => {
        //         setPage(1);
        //         setLimit(10);
        //         setFilterPolicy(filter.search);
        //         setFilterApp(filter.app);
        //       }}
        //       closeAction={() => {}}
        //     />
        //   )
        // }
      />
    </>
  );
};

export default Controles;
