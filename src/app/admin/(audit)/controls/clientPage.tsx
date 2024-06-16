"use client";
import MainCard from "@/components/cards/MainCard";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { Box, Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TemplatesData } from "../plantillas/types";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { useSession } from "@/hooks/useSession";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";
import {
  ControlsHeader,
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
  initialAddModalInfo,
} from "./types";
import { CustomDialog } from "@/components/modals";

interface ControlProps {
  idTemplate?: string;
  exists: boolean;
}

const ControlsPage = ({ idTemplate, exists }: ControlProps) => {
  const { sessionRequest, getPermissions } = useSession();
  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);

  /*************************************************************************/
  const [editionControlGroup, setEditionControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);
  const [editionControlSpecific, setEditionControlSpecific] = useState<
    CUControlSpecificType | undefined
  >(undefined);
  /*************************************************************************/

  const [selectedControlGroup, setSelectedControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);

  const [addModalInfo, setAddModalInfo] =
    useState<AddModalInfo>(initialAddModalInfo);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [templatesData, setTemplatesData] = useState<TemplatesData[]>([]);
  const [actualTemplate, setActualTemplate] = useState<
    TemplatesData | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);

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
      const ActualTemplate: TemplatesData[] = res.data?.rows;
      setTemplatesData(res.data?.rows);
      if (idTemplate) {
        const actualTemplate: TemplatesData | undefined = ActualTemplate.find(
          (elem) => elem.id === idTemplate
        );
        setActualTemplate(actualTemplate);
      }
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

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/controles");
      console.log(data);
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient().finally(() => {
      getTemplateRequest().finally(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, idTemplate]);

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
      const dos: CUControlSpecificType[] = res2.data.rows;
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

  const getControlGroupRequest = async () => {
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

  useEffect(() => {}, [selectedControlGroup, setSelectedControlGroup]);
  const closeModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };

  const acceptModalControlSpecific = async () => {
    // setEditionControlGroup(undefined);
    const id = editionControlGroup?.id;
    await delay(100);
    if (id) await getControlSpecificRequest(id);
    setAddModalInfo(initialAddModalInfo);
  };

  const acceptModalControlGroup = async () => {
    await getControlGroupRequest();
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };

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
      <>
        {loading ? (
          <LoadingControlsSkeleton />
        ) : (
          <>
            {templatesData.length === 0 ? (
              <NoTemplate />
            ) : (
              <>
                {!exists && <TemplateSelector data={templatesData} />}

                {actualTemplate !== undefined && idTemplate !== undefined && (
                  <ControlsHeader
                    idControlGroup={selectedControlGroup?.id}
                    exists={exists}
                    permissions={permissions}
                    title={actualTemplate.name}
                    actionGroup={() => {
                      setAddModalInfo({
                        state: true,
                        isGroup: true,
                      });
                      setEditionControlGroup({ idTemplate });
                    }}
                    actionControlSpecific={(groupId: string) => {
                      setAddModalInfo({
                        state: true,
                        isGroup: false,
                        groupId,
                      });
                    }}
                  />
                )}

                <Box height={20} />

                <MainCard padding={false} radius="0.4rem">
                  <PanelGroup
                    direction="horizontal"
                    style={{ minHeight: "78vh" }}
                  >
                    <LeftPanel
                      exists={exists}
                      idTemplate={idTemplate ?? ""}
                      dataControls={dataControls}
                      editionControlGroup={selectedControlGroup}
                      setEditionControlGroup={setSelectedControlGroup}
                    />

                    <RightPanel
                      permissions={permissions}
                      editionControlGroup={selectedControlGroup}
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
