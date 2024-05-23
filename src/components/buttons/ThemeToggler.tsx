"use client";
import { IconButton, IconButtonProps, Tooltip, useTheme } from "@mui/material";
import { useThemeContext } from "@/theme";
import { Icono } from "../Icono";
import { Sun, Moon } from "lucide-react";

export const ThemeToggler = ({ ...rest }: IconButtonProps) => {
  const { themeMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <Tooltip
      sx={{
        border: 1,
        borderRadius: "50%",
        borderColor: theme.palette.divider,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : "transparent",
      }}
      title={themeMode ? `Cambiar a modo oscuro` : `Cambiar a modo claro`}
    >
      <IconButton {...rest} onClick={toggleTheme}>
        <Icono color="inherit">{themeMode ? <Sun /> : <Moon />}</Icono>
      </IconButton>
    </Tooltip>
  );
};
