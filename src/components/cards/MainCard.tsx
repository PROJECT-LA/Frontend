"use client";
import { useThemeContext } from "@/theme";
import { CONSTANTS } from "../../../config";
import { Card, useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

interface MainCard {
  children: ReactNode;
  padding?: boolean;
  radius?: string;
  height?: string;
  boxShadow?: boolean;
  border?: boolean;
}

const MainCard = ({
  children,
  padding = true,
  radius = CONSTANTS.borderRadius,
  height = "auto",
  boxShadow = false,
  border = true,
}: MainCard) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Card
      sx={{
        border: border ? 1 : 0,
        borderRadius: radius,
        height,
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : "transparent !important",
        padding: !padding ? "0" : !matchDownMd ? "2.5rem" : "1rem",
        boxShadow: boxShadow ? CONSTANTS.boxShadow : 0,
      }}
    >
      {children}
    </Card>
  );
};

export default MainCard;
