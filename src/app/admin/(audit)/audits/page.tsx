"use client";
import React, { useState, useEffect } from "react";
import { PermissionTypes, initialPermissions } from "@/utils/permissions";
import {
  Box,
  Grid,
  Input,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FormInputAutocomplete, FormInputDropdown } from "@/components/forms";
import { useForm } from "react-hook-form";
import { optionType } from "@/components/forms/FormInputDropdown";
import CustomTabAudit from "./ui/CustomTabAudit";
import { useAuthStore, useGlobalStore } from "@/store";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { MessagesInterpreter, delay, print } from "@/utils";
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AuditPage = () => {
  const theme = useTheme();
  const { getPermissions, sessionRequest } = useSession();
  const { user } = useAuthStore();

  const [usersData, setUsersData] = useState<UserAudit[]>([]);
  const xs = useMediaQuery(theme.breakpoints.only("md"));

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

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        <Grid item xs={12} md={6} lg={4}>
          <Stack>
            <FormInputAutocomplete
              control={control}
              InputProps={{
                placeholder: "Busca usuario...",
              }}
              bgcolor={theme.palette.background.paper}
              id="searchUser"
              name="searchUser"
              searchIcon={true}
              options={options}
              label=""
              freeSolo
              newValues
              forcePopupIcon
              getOptionLabel={(option) => option.label}
              renderOption={(option) => <>{option.label}</>}
            />
          </Stack>
        </Grid>
      </Grid>

      <Box height={20} />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          scrollButtons
          allowScrollButtonsMobile
        >
          {usersData.map((elem) => (
            <Tab
              key={`user-audit-tab-${elem.id}`}
              label={elem.names}
              id={`user-audit-tab-${elem.id}`}
              aria-controls={`user-audit-tab-${elem.id}`}
              value={elem.id}
            />
          ))}
        </Tabs>
      </Box>
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
