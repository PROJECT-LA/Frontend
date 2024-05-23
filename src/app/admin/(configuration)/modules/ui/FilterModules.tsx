"use client";

import { FormInputText } from "@/components/forms";
import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

export interface FilterType {
  search: string;
}
export interface FilterModalModuleType {
  filterModule: string;
  correctAction: (filters: FilterType) => void;
  closeAction: () => void;
}

export const FilterModules = ({
  filterModule,
  correctAction,
}: FilterModalModuleType) => {
  const { control, watch } = useForm<FilterType>({
    defaultValues: {
      search: filterModule,
    },
  });

  const filterSearchWatch: string = watch("search");

  const debounced = useDebouncedCallback((filters: FilterType) => {
    correctAction(filters);
  }, 1000);

  const updateFilters = (filters: FilterType) => {
    debounced(filters);
  };
  useEffect(() => {
    updateFilters({ search: filterSearchWatch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSearchWatch]);

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputText
            id={"search"}
            name={"search"}
            control={control}
            label={"Filtro"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  );
};
