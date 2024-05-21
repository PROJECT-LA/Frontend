import { Button } from "@mui/material";
import { IconTooltip } from "./IconTooltip";
import { OverridableStringUnion } from "@mui/types";
import { ButtonPropsVariantOverrides } from "@mui/material/Button/Button";
import { ReactNode } from "react";

interface OwnIconButtonParams {
  id: string;
  alter?: "icono" | "boton";
  variant?: OverridableStringUnion<
    "text" | "outlined" | "contained",
    ButtonPropsVariantOverrides
  >;
  text: string;
  icon: ReactNode;
  description: string;
  action: () => void;
}

export const OwnIconButton = ({
  id,
  text,
  icon,
  alter = "boton",
  variant = "contained",
  description,
  action,
}: OwnIconButtonParams) => {
  return alter == "boton" ? (
    <Button
      id={id}
      variant={variant}
      sx={{ ml: 1, mr: 1 }}
      size={"small"}
      onClick={() => {
        action();
      }}
    >
      {text}
    </Button>
  ) : (
    <IconTooltip
      id={id}
      title={description}
      action={() => {
        action();
      }}
      icon={icon}
      name={text}
    />
  );
};
