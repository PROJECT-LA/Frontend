import {
  Box,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { IconoTooltip } from "../buttons/IconoTooltip";
import { FC } from "react";
import { print } from "@/utils";
import { styled } from "@mui/material/styles";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pagina: number;
  limite: number;
  total: number;
  cambioPagina: (nuevaPagina: number) => void;
  cambioLimite: (nuevoLimite: number) => void;
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
    // Use the system font instead of the default Roboto font.
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

export const Paginacion: FC<Props> = ({
  pagina,
  limite,
  total,
  cambioPagina,
  cambioLimite,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    print(`cambio limite: ${event.target.value}`);
    cambioPagina(1);
    cambioLimite(Number(event.target.value));
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ pt: 1, pb: 0 }}
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
            id="selector-limite"
            value={`${limite}`}
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
            {`${Math.max((pagina - 1) * limite, 1)}-${Math.min(
              pagina * limite,
              total
            )} de ${total}`}
          </Typography>
          <IconoTooltip
            id={"anteriorPagina"}
            name={"Anterior página"}
            desactivado={pagina == 1}
            titulo={"Anterior página"}
            accion={() => {
              cambioPagina(pagina - 1);
            }}
            icono={<ChevronLeft />}
          />
          <IconoTooltip
            id={"siguientePagina"}
            name={"Siguiente página"}
            desactivado={pagina * limite >= total}
            titulo={"Siguiente página"}
            accion={() => {
              cambioPagina(pagina + 1);
            }}
            icono={<ChevronRight />}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
