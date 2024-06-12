"use client";
import Typography from "@mui/material/Typography";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { RolType } from "../users/types";
import {
  print,
  MessagesInterpreter,
  siteName,
  delay,
  titleCase,
} from "@/utils";
import { Button, Chip, Grid, useMediaQuery, useTheme } from "@mui/material";
import { SortTypeCriteria, sortFilter } from "@/types";
import {
  IconTooltip,
  SearchButton,
  OwnIconButton,
  SortButton,
} from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { UsersModalView } from "../users/ui/UsersModal";
import { Pagination } from "@/components/datatable";
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { toast } from "sonner";
import {
  CirclePlus,
  Pencil,
  RotateCcw,
  SquareArrowOutUpRight,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { initialPermissions, PermissionTypes } from "@/utils/permissions";
import { CustomMessageState } from "@/components/states";
import { TemplatesData } from "./types";
import { TemplatesModalView } from "./ui";
import Link from "next/link";

export default function PoliticsPage() {
  const [showAlertModuleState, setShowAlertModuleState] =
    useState<boolean>(false);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);

  const [templateEdition, setTemplateEdition] = useState<
    TemplatesData | undefined
  >();

  const [loading, setLoading] = useState<boolean>(true);
  // const [showPolicyFilter, setShowPolicyFilter] = useState(false);
  // const [filterPolicy, setFilterPolicy] = useState<string>("");
  // const [filterApp, setFilterApp] = useState<string>("");
  const [errorData, setErrorData] = useState<any>();
  const [modalTemplate, setModalTemplate] = useState(false);

  const [showAlertDeletePolicy, setShowAlertDeletePolicy] = useState(false);

  const [rolesData, setRolesData] = useState<RolType[]>([]);

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const { sessionRequest, getPermissions } = useSession();

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("xs"));

  const [ordenCriterios, setOrdenCriterios] = useState<Array<SortTypeCriteria>>(
    [
      { field: "nombre", name: "Nombre", sort: true },
      { field: "description", name: "Descripción", sort: true },
      { field: "version", name: "Versión", sort: true },
      { field: "status", name: "Estado", sort: true },
      { field: "control", name: "Control" },
      { field: "actions", name: "Acciones" },
    ]
  );

  const contenidoTabla: Array<Array<ReactNode>> = templatesData.map(
    (template, indexTemplate) => [
      <Typography
        key={`${template.name}-${indexTemplate}-name`}
        variant={"body2"}
      >{`${template.name}`}</Typography>,
      <Typography
        key={`${template.name}-${indexTemplate}-description`}
        variant={"body2"}
      >{`${template.description}`}</Typography>,
      <Typography
        key={`${template.name}-${indexTemplate}-version`}
        variant={"body2"}
      >{`${template.version}`}</Typography>,

      <CustomMessageState
        key={`${template.name}-status`}
        title={template.status}
        description={template.status}
        color={
          template.status == "ACTIVO"
            ? "success"
            : template.status == "INACTIVO"
            ? "error"
            : "info"
        }
      />,

      <Grid key={`${template.name}-${indexTemplate}-controls`}>
        <Link
          href={`${CONSTANTS.sitePath}/admin/controles?template=${template.id}`}
        >
          <Button variant="text" endIcon={<SquareArrowOutUpRight />}>
            Ver controles
          </Button>
        </Link>
      </Grid>,

      <Grid key={`${template.name}-${indexTemplate}-actions`}>
        {permissions.update && (
          <IconTooltip
            id={`cambiarEstadoModulo-${template.name}`}
            title={template.status == "ACTIVO" ? "Inactivar" : "Activar"}
            color={template.status == "ACTIVO" ? "success" : "error"}
            action={() => changeStateModuleModal(template)}
            deactivate={template.status == "PENDIENTE"}
            icon={
              template.status == "ACTIVO" ? <ToggleRight /> : <ToggleLeft />
            }
            name={
              template.status == "ACTIVO"
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
              editarPoliticaModal(template);
            }}
            icon={<Pencil />}
            name={"Editar template"}
          />
        )}

        {permissions.delete && (
          <IconTooltip
            id={`eliminarPolitica-${indexTemplate}`}
            title={"Eliminar"}
            color={"error"}
            action={() => {
              deleteTemplateModal(template);
            }}
            icon={<Trash2 />}
            name={"Eliminar template"}
          />
        )}
      </Grid>,
    ]
  );

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
        await getTemplateRequest();
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
          addTemplateModal();
        }}
      />
    ),
  ];

  const getTemplateRequest = async () => {
    try {
      setLoading(true);

      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/templates`,
        params: {
          page,
          limit,
        },
      });
      setTemplatesData(res.data?.rows);
      setTotal(res.data?.total);
      setErrorData(null);
    } catch (e) {
      setErrorData(e);
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplateRequest = async (idTemplate: string) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/policies/${idTemplate}`,
        type: "delete",
      });
      toast.success("Éxito", { description: MessagesInterpreter(res) });
      await getTemplateRequest();
    } catch (e) {
      toast.error("Error", { description: MessagesInterpreter(e) });
    } finally {
      setLoading(false);
    }
  };

  const changeTemplateState = async (template: TemplatesData) => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/templates/${template.id}/change-status`,
        type: "patch",
      });
      toast.success(MessagesInterpreter(res));
      await getTemplateRequest();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const editarPoliticaModal = (template: TemplatesData) => {
    setTemplateEdition(template);
    // setPolicyEdition(politica);
    setModalTemplate(true);
  };

  const changeStateModuleModal = async (template: TemplatesData) => {
    setShowAlertModuleState(true);
    setTemplateEdition(template);
  };

  const cerrarModalPolitica = async () => {
    setModalTemplate(false);
    await delay(500);
    // setPolicyEdition(undefined);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/plantillas");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient().finally(() => {
      getTemplateRequest().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, JSON.stringify(ordenCriterios)]);

  const addTemplateModal = () => {
    setModalTemplate(true);
  };

  const deleteTemplateModal = (template: TemplatesData) => {
    setTemplateEdition(template);
    setShowAlertDeletePolicy(true);
  };

  const cancelAlertDeleteTemplate = () => {
    setShowAlertDeletePolicy(false);
    // setPolicyEdition(undefined);
  };

  const acceptAlertDeleteTemplate = async () => {
    setShowAlertDeletePolicy(false);
    // if (policyEdition) {
    //   await eliminarPoliticaPeticion(policyEdition);
    // }
  };

  const acceptAlertTemplateState = async () => {
    if (templateEdition !== undefined)
      await changeTemplateState(templateEdition);
    setShowAlertModuleState(false);
    setTemplateEdition(undefined);
  };

  const cancelAlertTemplateState = () => {
    setShowAlertModuleState(false);
    setTemplateEdition(undefined);
  };

  const closeCreateEditTemplateModal = async () => {
    setTemplateEdition(undefined);
    setModalTemplate(false);
  };

  return (
    <>
      <AlertDialog
        isOpen={showAlertModuleState}
        title={"Alerta"}
        text={`¿Está seguro de ${
          templateEdition?.status == "ACTIVO" ? "inactivar" : "activar"
        }  el template: ${titleCase(templateEdition?.name ?? "")} ?`}
      >
        <Button onClick={() => cancelAlertTemplateState()}>Cancelar</Button>
        <Button
          onClick={() => {
            acceptAlertTemplateState();
          }}
        >
          Aceptar
        </Button>
      </AlertDialog>
      <AlertDialog
        isOpen={showAlertDeletePolicy}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el template ${templateEdition?.name} ?`}
      >
        <Button onClick={() => {}}>Cancelar</Button>
        <Button onClick={() => {}}>Aceptar</Button>
      </AlertDialog>
      <CustomDialog
        isOpen={modalTemplate}
        handleClose={cerrarModalPolitica}
        title={templateEdition ? "Editar plantilla" : "Nueva plantilla"}
      >
        <TemplatesModalView
          template={templateEdition}
          correctAction={() => {
            closeCreateEditTemplateModal().finally();
            getTemplateRequest().finally();
          }}
          cancelAction={() => {
            closeCreateEditTemplateModal().finally();
          }}
        />
      </CustomDialog>
      <CustomDataTable
        title={"Plantillas"}
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
}
