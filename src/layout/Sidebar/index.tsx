import { useTheme } from "@mui/material/styles";
import { Box, Drawer, Stack, useMediaQuery } from "@mui/material";

import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import { CONSTANTS } from "../../../config";
import { Logo, LogoCorto } from "../LogoSection";
import { useGlobalStore } from "@/store";

const drawerWidth = CONSTANTS.drawerWidth;

interface SidebarProps {
  drawerOpen: boolean;
  drawerToggle: () => void;
  window?: any;
}

const Sidebar = ({ drawerOpen, drawerToggle, window }: SidebarProps) => {
  const theme = useTheme();
  const { openDrawer } = useGlobalStore();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <>
      <Box
        component="span"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 4,
        }}
      >
        {openDrawer || !matchUpMd ? (
          <Stack direction="row" justifyContent="space-between">
            <Logo />
          </Stack>
        ) : (
          <LogoCorto />
        )}
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            display: "flex",
            flexDirection: "column",
            height: !matchUpMd ? "calc(100vh - 140px)" : "calc(100vh -  100px)",
            paddingLeft: openDrawer ? "25px" : 0,
            paddingRight: openDrawer ? "16px" : 0,
          }}
        >
          <MenuList />
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? drawerWidth : "auto",
      }}
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "permanent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: !matchUpMd ? drawerWidth : openDrawer ? drawerWidth : 75,
            background: theme.palette.background.paper,
            height: "100%",
            color: theme.palette.text.primary,
            borderRight: 1,
            borderColor: theme.palette.divider,
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
