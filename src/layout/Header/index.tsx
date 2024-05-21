"use client";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Button,
  Typography,
  Hidden,
  useMediaQuery,
} from "@mui/material";

// project imports
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";
import { IconTooltip } from "@/components/buttons";
// assets
import { CONSTANTS } from "../../../config";
import { Menu, Search } from "lucide-react";
import { ThemeToggler } from "@/components/buttons";
import { usePathname } from "next/navigation";
import { useGlobalStore } from "@/store";

const Header = ({
  handleLeftDrawerToggle,
  scrolled,
}: {
  handleLeftDrawerToggle: () => void;
  scrolled: boolean;
}) => {
  const theme = useTheme();
  const { toggleDrawer } = useGlobalStore();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={CONSTANTS.gridSpacing}
          alignItems="center"
        >
          <IconTooltip
            action={toggleDrawer}
            title="Abrir menú"
            name="menu"
            id="menu-hamburguesa"
            icon={<Menu />}
          />

          <Typography variant="h5">ADMINISTRADOR</Typography>
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Stack spacing={!matchDownMd ? 2 : 1} direction="row" alignItems="center">
        <Hidden mdDown={true}>
          <Button
            endIcon={<Search />}
            sx={{
              paddingBottom: 1,
              paddingTop: 1,
              transition: "all .3s ease",
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.background.paper
                  : "transparent",
            }}
            variant="outlined"
          >
            <Typography>Buscar</Typography>
            <Box width={20} />
          </Button>
        </Hidden>

        <NotificationSection />
        <ThemeToggler />
        <ProfileSection />
      </Stack>
    </>
  );
};

export default Header;
