// Librerías
import Box from "@mui/material/Box";
import { Grid, Hidden, useTheme } from "@mui/material";

// Componentes y hooks
import { ThemeToggler } from "@/components/buttons";
import { LoginSlider } from "./ui/LoginSlider";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <Grid
      container
      justifyContent="space-evenly"
      sx={{ position: "relative", minHeight: "100vh" }}
      alignItems={"center"}
    >
      <Grid
        item
        lg={7}
        md={12}
        xs={12}
        alignContent="center"
        width="100%"
        minHeight="100vh"
        height="100%"
      >
        <Box sx={{ position: "absolute", top: 20, left: 20 }}>
          <ThemeToggler />
        </Box>

        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoginForm />
        </Box>
      </Grid>

      <Hidden lgDown={true}>
        <LoginSlider />
      </Hidden>
    </Grid>
  );
}
