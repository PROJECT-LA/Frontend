"use client";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import {
  Box,
  List,
  ListItem,
  Skeleton,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CONSTANTS } from "../../../../../config";
import { MessagesInterpreter, delay, siteName } from "@/utils";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { TabPanelModules } from "./ui";
import { RolCRUDType } from "../users/types";
import { TabPanelProps } from "./types";

const ModulesClient2 = () => {
  const theme = useTheme();
  const [roles, setRoles] = useState<RolCRUDType[]>([]);
  const [value, setValue] = React.useState(0);
  const [tab, setTab] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(true);
  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const { sessionRequest, getPermissions } = useSession();

  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles`,
      });
      setRoles(res.data.rows);
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/modules");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient()
      .then(() => {
        getRoles().finally(() => {});
      })
      .finally(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <title>{`Módulos - ${siteName()}`}</title>
      {loading ? (
        <List>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <ListItem key={`modules-list-skeleton-wait-${index}`}>
                <Skeleton width="100%" height="4rem" />
              </ListItem>
            ))}
        </List>
      ) : (
        <>
          <Box position="relative" marginTop={2}>
            {!loading && (
              <Box
                position="absolute"
                width="100%"
                borderBottom={1.5}
                bottom={0}
                borderColor={theme.palette.primary.main}
                zIndex={0}
              />
            )}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="audit page data"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                zIndex: 10,
              }}
            >
              {roles.map((elem, index) => (
                <Tab
                  key={`tab-content-roles-${index}`}
                  label={elem.name}
                  id={`simple-tab-${index}`}
                  aria-controls={`modules-by-role-tab-${index}`}
                  onClick={(e) => setTab(elem.id)}
                  sx={{
                    backgroundColor:
                      tab === elem.id
                        ? theme.palette.background.paper
                        : "transparent",
                    position: "relative",
                    borderTop: tab === elem.id ? 1.5 : 0,
                    borderLeft: tab === elem.id ? 1.5 : 0,
                    borderRight: tab === elem.id ? 1.5 : 0,
                    borderTopLeftRadius: tab === elem.id ? 4 : 0,
                    borderTopRightRadius: tab === elem.id ? 4 : 0,
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {roles.map((elem, index) => (
            <CustomTabPanel
              key={`custom-roles-pane-${elem.id}`}
              value={value}
              index={Number(index)}
            >
              <TabPanelModules
                index={index}
                permissions={permissions}
                rolId={elem.id}
                rolName={elem.name}
              />
            </CustomTabPanel>
          ))}
        </>
      )}
    </>
  );
};

export default ModulesClient2;

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}
