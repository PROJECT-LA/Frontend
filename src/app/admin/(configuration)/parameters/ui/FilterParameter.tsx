import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { FormInputText } from "@/components/forms";

export interface FilterType {
  parameter: string;
}

export interface FilterParameterType {
  filterParameter: string;
  correctAction: (filters: FilterType) => void;
  closeAction: () => void;
}

export const FilterParameter = ({
  filterParameter,
  correctAction,
}: FilterParameterType) => {
  const { control, watch } = useForm<FilterType>({
    defaultValues: {
      parameter: filterParameter,
    },
  });

  const newParameterFilter: string | undefined = watch("parameter");

  useEffect(() => {
    filterUpdate({
      parameter: newParameterFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParameterFilter]);

  const debounced = useDebouncedCallback((filtros: FilterType) => {
    correctAction(filtros);
  }, 1000);

  const filterUpdate = (filtros: FilterType) => {
    debounced(filtros);
  };

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={"parameter"}
            name={"parameter"}
            control={control}
            label={"Buscar parámetro"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  );
};
