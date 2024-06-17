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
import { useAuthStore } from "@/store";
import { useSession } from "@/hooks/useSession";

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
  const { getPermissions } = useSession();
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

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getPermissionsClient = async () => {
      const data = await getPermissions("/admin/audits");
      if (data !== undefined) setPermissions(data);
    };
    getPermissionsClient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {Array(10)
            .fill(0)
            .map((elem, index) => (
              <Tab
                key={`simple-tab-${index}`}
                label="Item One"
                id={`simple-tab-${index}`}
                aria-controls={`simple-tabpanel-${index}`}
              />
            ))}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CustomTabAudit permissions={permissions} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
};

export default AuditPage;
