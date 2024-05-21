import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { RolType } from "../types";
import { FormInputDropdownMultiple } from "@/components/forms/FormDropdownMultiple";
import { FormInputText } from "@/components/forms";

export interface FilterType {
  user: string;
  roles: string[];
}

export interface UserModalFilterType {
  availableRoles: RolType[];
  rolesFilter: string[];
  usersFilter: string;
  correctAction: (filtros: FilterType) => void;
  closeAction: () => void;
}

export const UsersFilter = ({
  availableRoles,
  rolesFilter,
  usersFilter,
  correctAction,
}: UserModalFilterType) => {
  const { control, watch } = useForm<FilterType>({
    defaultValues: {
      user: usersFilter,
      roles: rolesFilter,
    },
  });

  const userFilterWatch: string = watch("user");
  const rolesFilterWatch: string[] = watch("roles");

  const debounced = useDebouncedCallback((filters: FilterType) => {
    correctAction(filters);
  }, 1000);

  const updateFilters = (filtros: FilterType) => {
    debounced(filtros);
  };

  useEffect(() => {
    updateFilters({
      user: userFilterWatch,
      roles: rolesFilterWatch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilterWatch, rolesFilterWatch]);

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={"nombre"}
            name={"user"}
            control={control}
            label={"Nombre"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputDropdownMultiple
            id={"roles"}
            name="roles"
            control={control}
            label="Roles"
            bgcolor={"background.paper"}
            options={availableRoles.map((rol) => ({
              key: rol.id,
              value: rol.id,
              label: rol.name,
            }))}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
