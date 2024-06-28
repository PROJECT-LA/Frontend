"use client";
import { useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, Hidden, useMediaQuery } from "@mui/material";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";
import { IconTooltip } from "@/components/buttons";
import { CONSTANTS } from "../../../config";
import { Menu } from "lucide-react";
import { ThemeToggler } from "@/components/buttons";
import { useGlobalStore } from "@/store";
import SearchSection from "./SearchSection";

const Header = () => {
  const theme = useTheme();
  const { toggleDrawer, titlePage, containerTitle } = useGlobalStore();
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
          {containerTitle.length > 0 ? (
            <Stack direction="row" alignItems="center">
              <Typography variant="h5" fontWeight={300}>
                {`${containerTitle}`}
              </Typography>
              <Box width={10} />
              <Typography variant="h5" fontWeight={300}>
                /
              </Typography>
              <Box width={10} />
              <Typography variant="h5" color="primary.main">
                {titlePage}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h5">{titlePage}</Typography>
          )}
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Stack spacing={!matchDownMd ? 2 : 1} direction="row" alignItems="center">
        <Hidden mdDown={true}>
          <SearchSection />
        </Hidden>

        <NotificationSection />
        <ThemeToggler />
        <ProfileSection />
      </Stack>
    </>
  );
};

export default Header;
