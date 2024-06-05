"use client";
import { useThemeContext } from "@/theme";
import { CONSTANTS } from "../../../config";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

interface MainCard {
  children: ReactNode;
  padding?: boolean;
}

const MainCard = ({ children, padding = true }: MainCard) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Card
      sx={{
        border: 1,
        borderRadius: CONSTANTS.borderRadius,
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : "transparent !important",
        padding: !padding ? "0" : !matchDownMd ? "2.5rem" : "1rem",
      }}
    >
      {children}
    </Card>
  );
};

export default MainCard;
