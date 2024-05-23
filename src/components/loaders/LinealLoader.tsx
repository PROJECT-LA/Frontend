import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

interface LinealLoaderProps {
  mostrar?: boolean;
}

export function LinealLoader({ mostrar = true }: LinealLoaderProps) {
  return mostrar ? (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  ) : null;
}
