import {
  Box,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { IconTooltip } from "../buttons/IconTooltip";
import { FC } from "react";
import { print } from "@/utils";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  limit: number;
  total: number;
  changePage: (newPage: number) => void;
  changeLimit: (newLimit: number) => void;
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "5px 26px 5px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export const Pagination: FC<Props> = ({
  page,
  limit,
  total,
  changePage,
  changeLimit,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    print(`cambio limit: ${event.target.value}`);
    changePage(1);
    changeLimit(Number(event.target.value));
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ pt: 1, pb: 0, px: 2 }}
    >
      <Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            borderRadius: 1,
            alignItems: "center",
          }}
        >
          <Typography color={"text.secondary"} variant={"body2"} sx={{ pr: 2 }}>
            Filas por página
          </Typography>
          <Select
            id="selector-limit"
            value={`${limit}`}
            onChange={handleChange}
            input={<BootstrapInput />}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </Box>
      </Grid>

      <Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            m: 0,
            borderRadius: 1,
            alignItems: "center",
          }}
        >
          <Typography color={"text.secondary"} variant={"body2"}>
            {`${Math.max((page - 1) * limit, 1)}-${Math.min(
              page * limit,
              total
            )} de ${total}`}
          </Typography>
          <IconTooltip
            id={"anteriorPagina"}
            name={"Anterior página"}
            deactivate={page == 1}
            title={"Anterior página"}
            action={() => {
              changePage(page - 1);
            }}
            icon={<ChevronLeft />}
          />
          <IconTooltip
            id={"siguientePagina"}
            name={"Siguiente página"}
            deactivate={page * limit >= total}
            title={"Siguiente página"}
            action={() => {
              changePage(page + 1);
            }}
            icon={<ChevronRight />}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
