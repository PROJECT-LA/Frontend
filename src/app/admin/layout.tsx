"use client";
import { styled, useTheme } from "@mui/material/styles";
import { AppBar, Toolbar, useMediaQuery } from "@mui/material";
import { CONSTANTS } from "../../../config";
import Header from "@/layout/Header";
import Sidebar from "@/layout/Sidebar";
import { useGlobalStore } from "@/store";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useEffect, useState } from "react";

interface MainProps {
  open: boolean;
  theme?: any;
}

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "theme",
})<MainProps>(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  position: "relative",
  borderBottomRightRadius: 0,
  width: `100%`,
  padding: "16px",
  transition: theme.transitions.create(
    "margin",
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }
  ),
  [theme.breakpoints.up("md")]: {
    marginTop: 90,
    marginLeft: open ? 20 : -(CONSTANTS.drawerWidth - 110),
    width: "92%",
    marginRight: "0.7rem",
    paddingBottom: 20,
  },
  [theme.breakpoints.up("xl")]: {
    marginLeft: open ? 110 : -(CONSTANTS.drawerWidth - 180),
    marginRight: "7.5rem",
  },
}));

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchUpXl = useMediaQuery(theme.breakpoints.up("xl"));

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { openDrawer, toggleDrawer } = useGlobalStore();

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar
        drawerOpen={!matchDownMd ? openDrawer : !openDrawer}
        drawerToggle={toggleDrawer}
      />

      <AppBar
        enableColorOnDark
        position="fixed"
        sx={{
          boxShadow: scrolled ? CONSTANTS.boxShadow : "none",
          bgcolor: theme.palette.background.default,
          transition: openDrawer ? theme.transitions.create("width") : "none",
        }}
      >
        <Toolbar
          sx={{
            paddingY: scrolled ? 1 : 2,
            transition: "all .3s ease",
            marginTop: "0.5rem",
            marginLeft: matchUpXl
              ? openDrawer
                ? "20rem"
                : "10rem"
              : !matchDownMd
              ? openDrawer
                ? "14.5rem"
                : "5.5rem"
              : "0rem",
            marginRight: matchUpXl ? "7rem" : "0.5rem",
            borderColor: theme.palette.divider,
          }}
        >
          <Header handleLeftDrawerToggle={toggleDrawer} scrolled={scrolled} />
        </Toolbar>
      </AppBar>
      <Main theme={theme} open={openDrawer}>
        {children}
      </Main>
    </div>
  );
};

export default MainLayout;
