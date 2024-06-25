"use client";
import React, { useState, useEffect } from "react";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import { Box, Grid, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { FormInputAutocomplete } from "@/components/forms";
import { useForm } from "react-hook-form";
import { optionType } from "@/components/forms/FormInputDropdown";
import CustomTabAudit from "./ui/CustomTabAudit";
import { useAuthStore } from "@/store";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { MessagesInterpreter, delay } from "@/utils";
import { CONSTANTS } from "../../../../../config";
import { UserAudit } from "./types";

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingY={3}>{children}</Box>}
    </div>
  );
}

const AuditPage = () => {
  const theme = useTheme();
  const { getPermissions, sessionRequest } = useSession();
  const { user } = useAuthStore();

  const [usersData, setUsersData] = useState<UserAudit[]>([]);

  const { control } = useForm<{ searchUser: string }>({
    defaultValues: {
      searchUser: "",
    },
  });
  const [options, setOptions] = useState<Array<optionType>>([]);

  const [permissions, setPermissions] =
    useState<PermissionTypes>(initialPermissions);
  const [loading, setLoading] = useState<boolean>(true);

  const [value, setValue] = React.useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getUsersAuditRequest = async () => {
    try {
      setLoading(true);
      if (user?.idRole !== undefined) {
        const res = await sessionRequest({
          url: `${CONSTANTS.baseUrl}/users/${user?.idRole}/role`,
        });
        await delay(100);
        setUsersData(res.data);
        const optionsUser: Array<optionType> = [];
        for (const elemUser of res.data) {
          optionsUser.push({
            key: `options-user-search-${elemUser.id}`,
            label: `${elemUser.names} ${elemUser.lastNames}`,
            value: elemUser.id,
          });
        }
        setOptions(optionsUser);
        toast.success(MessagesInterpreter(res));
      }
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/audits");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient()
      .then(() => getUsersAuditRequest().finally(() => {}))
      .finally(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [tab, setTab] = useState<string>("1");

  return (
    <Box sx={{ width: "100%" }}>
      <Box height={20} />
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Box position="relative">
            <Box
              position="absolute"
              width="100%"
              borderBottom={1.5}
              bottom={0}
              borderColor={theme.palette.primary.main}
              zIndex={0}
            />
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              scrollButtons
              allowScrollButtonsMobile
              sx={{
                zIndex: 10,
              }}
            >
              {usersData.map((elem) => (
                <Tab
                  key={`user-audit-tab-${elem.id}`}
                  label={elem.names}
                  id={`user-audit-tab-${elem.id}`}
                  aria-controls={`user-audit-tab-${elem.id}`}
                  value={elem.id}
                  onClick={(e) => setTab(elem.id)}
                  sx={{
                    backgroundColor:
                      tab === elem.id
                        ? theme.palette.background.default
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
        </Grid>
        <Grid item xs={4}>
          <FormInputAutocomplete
            control={control}
            InputProps={{
              placeholder: "Busca usuario...",
            }}
            bgcolor={theme.palette.background.paper}
            id="searchUser"
            name="searchUser"
            searchIcon={true}
            onChange={(e: any) => {
              if (e && e.value !== undefined) {
                handleChange(e, e.value);
                setTab(e.value);
              }
            }}
            options={options}
            label=""
            freeSolo
            newValues
            forcePopupIcon
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <>{option.label}</>}
          />
        </Grid>
      </Grid>

      {usersData.map((elem) => (
        <CustomTabPanel
          value={value}
          index={elem.id}
          key={`user-audit-content-${elem.id}`}
        >
          <CustomTabAudit idUser={elem.id} permissions={permissions} />
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default AuditPage;
