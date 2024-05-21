/// Vista modal de filtro de usuarios
import React from "react";
import { useForm } from "react-hook-form";

import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material";
import { FilterType, UserModalFilterType } from "./UserFilter";
import { FormInputDropdownMultiple } from "@/components/forms/FormDropdownMultiple";

export const UserModalFilter = ({
  availableRoles,
  rolesFilter,
  correctAction,
}: UserModalFilterType) => {
  const { handleSubmit, control } = useForm<FilterType>({
    defaultValues: {
      roles: rolesFilter,
    },
  });

  return (
    <form onSubmit={handleSubmit(correctAction)}>
      <DialogContent>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Box height={"10px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={12}>
              <FormInputDropdownMultiple
                id={"roles"}
                name="roles"
                control={control}
                label="Roles"
                options={availableRoles.map((rol) => ({
                  key: rol.id,
                  value: rol.id,
                  label: rol.name,
                }))}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"30px"} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: {
            xs: "center",
          },
        }}
      >
        <Button variant={"contained"} type={"submit"}>
          Aplicar
        </Button>
      </DialogActions>
    </form>
  );
};
