import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { FormInputText } from "@/components/forms";

export interface FilterType {
  role: string;
}

export interface FilterRoleType {
  roleFilter: string;
  correctAction: (filters: FilterType) => void;
  closeAction: () => void;
}

export const RoleFilter = ({ roleFilter, correctAction }: FilterRoleType) => {
  const { control, watch } = useForm<FilterType>({
    defaultValues: {
      role: roleFilter,
    },
  });

  const roleFilterWatch: string | undefined = watch("role");

  useEffect(() => {
    updateFilters({
      role: roleFilterWatch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilterWatch]);

  const debounced = useDebouncedCallback((filters: FilterType) => {
    correctAction(filters);
  }, 1000);

  const updateFilters = (filters: FilterType) => {
    debounced(filters);
  };

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={"filtroRol"}
            name={"role"}
            control={control}
            label={"Buscar rol"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  );
};
