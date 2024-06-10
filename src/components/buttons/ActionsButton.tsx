"use client";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Icono } from "@/components/Icono";
import React, { MouseEventHandler, ReactNode, useState } from "react";
import { AlignLeft } from "lucide-react";

interface ActionType {
  color?:
    | "inherit"
    | "action"
    | "disabled"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  title: string;
  icon: ReactNode;
  action: MouseEventHandler<any> | undefined;
  deactivate?: boolean;
  show?: boolean;
  name: string;
  id: string;
}

interface ActionsButton {
  deactivate?: boolean;
  color?:
    | "inherit"
    | "action"
    | "disabled"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  alter?: "icono" | "boton";
  text?: string;
  actions: Array<ActionType>;
  icon?: ReactNode;
  label: string;
  id: string;
}

export const ActionsButton = ({
  deactivate = false,
  color = "primary",
  actions = [],
  icon = <AlignLeft size={18} />,
  alter = "icono",
  text = "acciones",
  label,
  id,
}: ActionsButton) => {
  const [actionsButtonAnchorEl, setActionsButtonAnchorEl] =
    useState<null | HTMLElement>(null);

  const dropdownMenu = (event: React.MouseEvent<HTMLElement>) => {
    setActionsButtonAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setActionsButtonAnchorEl(null);
  };

  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  return (
    <Tooltip
      title={label}
      onClose={handleTooltipClose}
      open={openTooltip}
      onMouseOver={() => {
        if (!actionsButtonAnchorEl) handleTooltipOpen();
      }}
    >
      <span>
        {alter == "boton" && (
          <Button
            id={id}
            aria-label={label}
            variant={"contained"}
            sx={{ ml: 1, mr: 1 }}
            size={"small"}
            onClick={(event) => {
              handleTooltipClose();
              dropdownMenu(event);
            }}
            disabled={deactivate}
            color="primary"
            startIcon={icon}
          >
            {text}
          </Button>
        )}
        {alter == "icono" && (
          <IconButton
            id={id}
            aria-label={label}
            size="small"
            disabled={deactivate}
            onClick={(event) => {
              handleTooltipClose();
              dropdownMenu(event);
            }}
            color="primary"
          >
            <Icono color={deactivate ? "disabled" : color}>{icon}</Icono>
          </IconButton>
        )}
        <Menu
          id="menu-acciones"
          anchorEl={actionsButtonAnchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(actionsButtonAnchorEl)}
          onClose={closeMenu}
          autoFocus={false}
        >
          {actions
            .filter((value) => value.show)
            .map((accion, index) => (
              <MenuItem
                sx={{ px: 2, py: 1.5, m: 0 }}
                id={accion.id}
                key={`${index}-accion`}
                onClick={(event) => {
                  closeMenu();
                  if (accion.action) return accion.action(event);
                }}
                disabled={accion.deactivate}
              >
                <Icono color={accion.color}>{accion.icon}</Icono>
                <Box width={"11px"} />
                <Typography variant={"body2"}>{accion.title}</Typography>
              </MenuItem>
            ))}
        </Menu>
      </span>
    </Tooltip>
  );
};
