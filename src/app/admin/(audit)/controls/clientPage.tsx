"use client";
import MainCard from "@/components/cards/MainCard";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { Box, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TemplatesData } from "../templates/types";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import {
  LoadingControlsSkeleton,
  ModalControlGroup,
  ModalControlSpecific,
  NoTemplate,
  TemplateSelector,
  LeftPanel,
  RightPanel,
} from "./ui";
import { PanelGroup } from "react-resizable-panels";
import {
  AddModalInfo,
  CUControlGroupType,
  CUControlSpecificType,
  ControlGroupType,
  ControlSpecificType,
  initialAddModalInfo,
} from "./types";
import { AlertDialog, CustomDialog } from "@/components/modals";
import { optionType } from "@/components/forms/FormInputDropdown";
interface ControlProps {
  idTemplate: string;
}

const ControlsPage = ({ idTemplate }: ControlProps) => {
  console.log(idTemplate);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    idTemplate ?? ""
  );
  const { sessionRequest, getPermissions } = useSession();
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);
  const [optionsTemplate, setOptionsTemplate] = useState<Array<optionType>>([]);

  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);
  const [editionControlGroup, setEditionControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);
  const [editionControlSpecific, setEditionControlSpecific] = useState<
    CUControlSpecificType | undefined
  >(undefined);
  const [deleteControlGroup, setDeleteControlGroup] = useState<boolean>(false);
  const [deleteControlSpecific, setDeleteControlSpecific] =
    useState<boolean>(false);
  const [selectedControlGroup, setSelectedControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);
  const [addModalInfo, setAddModalInfo] =
    useState<AddModalInfo>(initialAddModalInfo);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingControls, setLoadingControls] = useState<boolean>(false);

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/controls");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient().finally(() => {
      getTemplateRequest().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, idTemplate]);
  /****************************  ESTADOS  *******************************/

  /***************************  REQUESTS  *******************************/
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
      const optionTemporal: Array<optionType> = [];
      for (const template of res.data?.rows) {
        optionTemporal.push({
          key: `option-template-search-${template.id}`,
          label: `${template.version} - ${template.name}`,
          value: template.id,
        });
      }
      setOptionsTemplate(optionTemporal);

      await delay(100);
      if (idTemplate !== undefined) {
        const res2 = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups`,
          params: {
            page: 1,
            limit: 30,
            idTemplate,
          },
        });
        setDataControls(res2.data.rows);
      }
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const updateTemplateView = async (newIdTemplate: string) => {
    try {
      setLoadingControls(true);
      setSelectedTemplate(newIdTemplate);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/control-groups`,
        params: {
          page: 1,
          limit: 30,
          idTemplate: newIdTemplate,
        },
      });
      setDataControls(res.data?.rows);
      setSelectedControlGroup(undefined);
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingControls(false);
    }
  };

  const getControlSpecificRequest = async (id: string) => {
    try {
      setLoading(true);
      await delay(100);
      const res2 = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/controls`,
        params: {
          page: 1,
          limit: 30,
          idControlGroup: id,
        },
      });
      const dos: ControlSpecificType[] = res2.data.rows;
      if (idTemplate) {
        setEditionControlGroup({
          ...editionControlGroup,
          controls: dos,
          idTemplate,
        });
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };

  const getControlGroupRequest = async (specific: boolean) => {
    try {
      setLoading(true);
      await delay(100);
      if (idTemplate) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups`,
          params: {
            page: 1,
            limit: 30,
            idTemplate,
          },
        });
        const data: ControlGroupType[] = res.data.rows;
        const uniqueSimil: ControlGroupType | undefined = data.find(
          (elem) => elem.id === selectedControlGroup?.id
        );
        setDataControls(res.data.rows);
        if (uniqueSimil !== undefined)
          setSelectedControlGroup({ ...uniqueSimil, idTemplate });
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const changeControlGroupStatus = async (id: string) => {
    try {
      setLoading(true);
      await delay(100);
      if (id) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups/${id}/change-status`,
          type: "PATCH",
        });
        toast.success(MessagesInterpreter(res));
        await getTemplateRequest();
        await delay(100);
        const res2 = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups`,
          params: {
            page: 1,
            limit: 30,
            idTemplate,
          },
        });
        const findSelected = res2.data.rows.find((elem: any) => elem.id === id);
        if (findSelected !== undefined && idTemplate !== undefined)
          setSelectedControlGroup({
            ...findSelected,
            idTemplate,
          });
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const changeControlSpecificStatus = async (id: string) => {
    try {
      setLoading(true);
      await delay(100);
      if (id) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/controls/${id}/change-status`,
          type: "PATCH",
        });
        toast.success(MessagesInterpreter(res));
        await delay(100);
        await getTemplateRequest();

        if (editionControlGroup !== undefined && editionControlGroup.id)
          await getControlSpecificRequest(editionControlGroup.id);
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const deleteControlGroupDelete = async (id: string) => {
    try {
      setLoading(true);
      await delay(100);
      if (id) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/control-groups/${id}`,
          type: "DELETE",
        });
        await getTemplateRequest();

        toast.success(MessagesInterpreter(res));
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };
  const deleteControlSpecificRequest = async (id: string) => {
    try {
      setLoading(true);
      await delay(100);
      if (id) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/controls/${id}`,
          type: "DELETE",
        });
        await getTemplateRequest();

        toast.success(MessagesInterpreter(res));
      }
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoading(false);
    }
  };

  /***************************  METHODS  ********************************/
  const closeModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };
  const acceptModalControlSpecific = async () => {
    // const id = editionControlGroup?.id;
    // // if (id) await getControlSpecificRequest(id);
    await delay(100);
    await getControlGroupRequest(true);

    setAddModalInfo(initialAddModalInfo);
  };
  const acceptModalControlGroup = async () => {
    await getControlGroupRequest(false);
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };
  const acceptDeleteControlGroup = async () => {
    if (selectedControlGroup !== undefined && selectedControlGroup.id)
      await deleteControlGroupDelete(selectedControlGroup.id);
    setSelectedControlGroup(undefined);
    cancelDeleteControlGroup();
  };
  const cancelDeleteControlGroup = () => {
    setDeleteControlGroup(false);
  };
  const acceptDeleteControlSpecific = async () => {
    if (editionControlSpecific !== undefined && editionControlSpecific.id)
      await deleteControlSpecificRequest(editionControlSpecific.id);

    if (editionControlGroup !== undefined && editionControlGroup.id)
      await getControlSpecificRequest(editionControlGroup.id);
    setDeleteControlSpecific(false);
  };
  const cancelDeleteControlSpecific = async () => {
    setEditionControlSpecific(undefined);
    setDeleteControlSpecific(false);
  };
  /***************************  METHODS  ********************************/

  return (
    <>
      <title>{`Controles - ${siteName()}`}</title>
      <CustomDialog
        isOpen={addModalInfo.state}
        handleClose={() => setAddModalInfo(initialAddModalInfo)}
        title={addModalInfo.isGroup ? "Nuevo grupo" : "Nuevo control"}
      >
        {!addModalInfo.isGroup && addModalInfo.groupId !== undefined ? (
          <ModalControlSpecific
            data={editionControlSpecific}
            groupId={addModalInfo.groupId}
            cancelAction={closeModalControl}
            correctAction={acceptModalControlSpecific}
          />
        ) : (
          <ModalControlGroup
            data={editionControlGroup}
            cancelAction={closeModalControl}
            correctAction={acceptModalControlGroup}
          />
        )}
      </CustomDialog>
      <AlertDialog
        isOpen={deleteControlGroup}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el control-group "${selectedControlGroup?.groupCode} - ${selectedControlGroup?.group}"?`}
      >
        <Button onClick={cancelDeleteControlGroup}>Cancelar</Button>
        <Button onClick={acceptDeleteControlGroup}>Aceptar</Button>
      </AlertDialog>
      <AlertDialog
        isOpen={deleteControlSpecific}
        title={"Alerta"}
        text={`¿Está seguro de eliminar el control-specific "${editionControlSpecific?.code} - ${editionControlSpecific?.name}"?`}
      >
        <Button onClick={cancelDeleteControlSpecific}>Cancelar</Button>
        <Button onClick={acceptDeleteControlSpecific}>Aceptar</Button>
      </AlertDialog>

      <>
        {loading ? (
          <LoadingControlsSkeleton />
        ) : (
          <>
            {templatesData.length === 0 ? (
              <NoTemplate />
            ) : (
              <>
                <TemplateSelector
                  permissions={permissions}
                  exists={selectedTemplate.length > 0}
                  idControlGroup=""
                  setIdTemplate={updateTemplateView}
                  data={optionsTemplate}
                  actionGroup={() => {
                    setAddModalInfo({
                      state: true,
                      isGroup: true,
                    });
                    setEditionControlGroup({
                      idTemplate: selectedTemplate ?? "",
                    });
                  }}
                  actionControlSpecific={(groupId: string) => {
                    setAddModalInfo({
                      state: true,
                      isGroup: false,
                      groupId,
                    });
                  }}
                />

                <Box height={20} />
                <MainCard padding={false} radius="0.4rem">
                  <PanelGroup
                    direction="horizontal"
                    style={{ minHeight: "78vh" }}
                  >
                    <LeftPanel
                      exists={selectedTemplate.length > 0}
                      idTemplate={idTemplate ?? ""}
                      loading={loadingControls}
                      dataControls={dataControls}
                      editionControlGroup={selectedControlGroup}
                      setEditionControlGroup={setSelectedControlGroup}
                    />
                    <RightPanel
                      permissions={permissions}
                      editionControlGroup={selectedControlGroup}
                      loading={loadingControls}
                      onEditControlGroup={() => {
                        setAddModalInfo({
                          state: true,
                          isGroup: true,
                        });
                        setEditionControlGroup(selectedControlGroup);
                      }}
                      onChangeState={async () => {
                        if (selectedControlGroup?.id)
                          await changeControlGroupStatus(
                            selectedControlGroup?.id
                          );
                      }}
                      onDeleteControlGroup={() => {
                        setDeleteControlGroup(true);
                      }}
                      onChangeStateControlSpecific={changeControlSpecificStatus}
                      onEditControlSpecific={(
                        editionSpecific: ControlSpecificType
                      ) => {
                        setEditionControlSpecific({
                          ...editionSpecific,
                          idControlGroup: selectedControlGroup?.id ?? "",
                        });
                        setAddModalInfo({
                          state: true,
                          isGroup: false,
                          groupId: selectedControlGroup?.id,
                        });
                      }}
                      onDeleteControlSpecific={(
                        editionSpecific: ControlSpecificType
                      ) => {
                        setEditionControlSpecific({
                          ...editionSpecific,
                          idControlGroup: selectedControlGroup?.id ?? "",
                        });
                        setDeleteControlSpecific(true);
                      }}
                    />
                  </PanelGroup>
                </MainCard>
              </>
            )}
          </>
        )}
      </>
    </>
  );
};
export default ControlsPage;
