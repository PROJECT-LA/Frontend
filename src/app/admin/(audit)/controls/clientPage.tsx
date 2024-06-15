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
  console.log(`*********************\n${idTemplate}`);

  const { sessionRequest, getPermissions } = useSession();

  const [dataControls, setDataControls] = useState<ControlGroupType[]>([]);
  const [editionControlGroup, setEditionControlGroup] = useState<
    CUControlGroupType | undefined
  >(undefined);

  const [editionControlSpecific, setEditionControlSpecific] = useState<
    CUControlSpecificType | undefined
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

  const closeModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    setAddModalInfo(initialAddModalInfo);
  };

  const acceptModalControl = async () => {
    setEditionControlGroup(undefined);
    setEditionControlSpecific(undefined);
    await delay(100);
    await getTemplateRequest();
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
        {addModalInfo.isGroup ? (
          <ModalControlGroup
            data={editionControlGroup}
            cancelAction={closeModalControl}
            correctAction={acceptModalControl}
          />
        ) : (
          <ModalControlSpecific
            data={editionControlSpecific}
            cancelAction={closeModalControl}
            correctAction={acceptModalControl}
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
                    idControlGroup={editionControlGroup?.id}
                    exists={exists}
                    permissions={permissions}
                    title={actualTemplate.name}
                    actionGroup={() => {
                      setAddModalInfo({
                        state: true,
                        isGroup: true,
                      });
                      setEditionControlGroup({
                        idTemplate,
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
                      editionControlGroup={editionControlGroup}
                      setEditionControlGroup={setEditionControlGroup}
                    />

                    <RightPanel
                      permissions={permissions}
                      editionControlGroup={editionControlGroup}
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
