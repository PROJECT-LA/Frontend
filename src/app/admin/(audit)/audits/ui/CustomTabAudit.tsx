import {
  Box,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { CONSTANTS } from "../../../../../../config";
import { useForm } from "react-hook-form";
import { FormInputAutocomplete } from "@/components/forms";
import { optionType } from "@/components/forms/FormInputDropdown";
import { PermissionTypes } from "@/utils/permissions";
import { ArrayFilterCustomTab } from "../types";

interface CustomTabAudit {
  permissions: PermissionTypes;
}

const CustomTabAudit = ({ permissions }: CustomTabAudit) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only("md"));
  const [options, setOptions] = useState<Array<optionType>>([]);
  const { control } = useForm<{ searchAudit: string }>({
    defaultValues: {
      searchAudit: "",
    },
  });

  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Stack spacing={CONSTANTS.gridSpacing}>
      <Stack direction="row" spacing={5} alignItems="center">
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          {ArrayFilterCustomTab.map((elem) => (
            <ToggleButton
              sx={{ paddingX: 2, paddingY: 0.6 }}
              key={`toggle-button-${elem.id}-${elem.type}`}
              value={elem.type}
            >
              {elem.value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box width="250px">
          <FormInputAutocomplete
            control={control}
            InputProps={{
              placeholder: "Busca auditoría...",
            }}
            bgcolor={theme.palette.background.paper}
            id="searchAudit"
            name="searchAudit"
            searchIcon={true}
            options={options}
            label=""
            freeSolo
            newValues
            forcePopupIcon
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <>{option.label}</>}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default CustomTabAudit;
