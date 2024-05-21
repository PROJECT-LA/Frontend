"use client";
import { useThemeContext } from "@/theme";
import { CONSTANTS } from "../../../config";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const MainCard = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Card
      sx={{
        border: 1,
        borderRadius: CONSTANTS.borderRadius,
        borderColor: theme.palette.divider,
        backgroundColor: !themeMode
          ? theme.palette.background.paper
          : "transparent !important",
        padding: !matchDownMd ? "2.5rem" : "1rem",
      }}
    >
      {children}
    </Card>
  );
};

export default MainCard;
