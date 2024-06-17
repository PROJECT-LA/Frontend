import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { FormInputText } from "@/components/forms";
import { LevelFilter, StatusLevelFilter } from "../types";

export interface FilterLevelsType {
  filterLevel: string;
  correctAction: (filters: LevelFilter) => void;
  closeAction: () => void;
}

export const FilterLevels = ({
  filterLevel,
  correctAction,
}: FilterLevelsType) => {
  const { control, watch } = useForm<LevelFilter>({
    defaultValues: {
      name: filterLevel,
      grade: filterLevel,
      status: "none",
    },
  });

  const newLevelFilter: string | undefined = watch("grade");
  const status: StatusLevelFilter = watch("status");

  useEffect(() => {
    filterUpdate({
      name: newLevelFilter,
      grade: newLevelFilter,
      status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newLevelFilter]);

  const debounced = useDebouncedCallback((filtros: LevelFilter) => {
    correctAction(filtros);
  }, 1000);

  const filterUpdate = (filtros: LevelFilter) => {
    debounced(filtros);
  };

  return (
    <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid item xs={12} sm={12} md={6}>
          <FormInputText
            id={"grade"}
            name={"grade"}
            control={control}
            label={"Buscar nivel"}
            bgcolor={"background.paper"}
            clearable
          />
        </Grid>
      </Grid>
    </Box>
  );
};
