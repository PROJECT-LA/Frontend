"use client";
import { FC, MouseEventHandler, ReactNode, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Icono } from "@/components/Icono";

interface Props {
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
  name: string;
  buttonSize?: "large" | "medium" | "small";
  id: string;
}

export const IconTooltip = ({
  color = "primary",
  icon,
  title,
  action,
  deactivate = false,
  buttonSize = "medium",
  name,
  id,
}: Props) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  return (
    <Tooltip
      title={title}
      onClose={handleTooltipClose}
      open={openTooltip}
      onMouseOver={handleTooltipOpen}
    >
      <span>
        <IconButton
          id={id}
          name={name}
          disabled={deactivate}
          classes={{
            root: "icon-button-root",
            disabled: "icon-button-disabled",
          }}
          aria-label={title}
          onClick={(event) => {
            handleTooltipClose();
            if (action) {
              action(event);
            }
          }}
          size={buttonSize}
        >
          <Icono color={deactivate ? "disabled" : color}> {icon}</Icono>
        </IconButton>
      </span>
    </Tooltip>
  );
};
