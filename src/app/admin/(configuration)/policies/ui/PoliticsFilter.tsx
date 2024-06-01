import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { FormInputDropdown } from "@/components/forms/FormInputDropdown";
import { FormInputText } from "@/components/forms";

export interface FilterType {
  search: string;
  app: string;
}

export interface ModalFilterPoliticsType {
  filterPolitic: string;
  filterApp: string;
  correctAction: (filters: FilterType) => void;
  closeAction: () => void;
}

export const PoliticsFilter = ({
  filterPolitic,
  filterApp,
  correctAction,
}: ModalFilterPoliticsType) => {
  const { control, watch } = useForm<FilterType>({
    defaultValues: {
      search: filterPolitic,
      app: filterApp,
    },
  });
  const filterSearchWatch: string = watch("search");
  const filtroAppWatch: string = watch("app");

  const debounced = useDebouncedCallback((filters: FilterType) => {
    correctAction(filters);
  }, 1000);
  const actualizacionFiltros = (filtros: FilterType) => {
    debounced(filtros);
  };
  const lapp: string[] = ["frontend", "backend"];

  useEffect(() => {
    actualizacionFiltros({
      search: filterSearchWatch,
      app: filtroAppWatch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSearchWatch, filtroAppWatch]);

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={4} alignContent="end">
          <FormInputText
            id={"search"}
            name={"search"}
            control={control}
            label={"Filtro"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormInputDropdown
            id={"apps"}
            name="app"
            control={control}
            label="App"
            options={lapp.map((la) => ({
              key: la,
              value: la,
              label: la,
            }))}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  );
};
