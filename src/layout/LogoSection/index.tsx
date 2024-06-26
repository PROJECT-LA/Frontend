import Link from "next/link";

import { ButtonBase, Stack, Typography, useTheme } from "@mui/material";

import { CONSTANTS } from "../../../config";

import { FilePieChart } from "lucide-react";
import { IconoLogo } from "./Logo";

export const LogoCorto = () => {
  const theme = useTheme();

  return (
    <Link href={CONSTANTS.sitePath}>
      <IconoLogo />
    </Link>
  );
};

export const Logo = () => {
  const theme = useTheme();

  return (
    <Link style={{ textDecoration: "none" }} href={CONSTANTS.sitePath}>
      <Stack direction="row" gap={1} alignItems="center">
        <IconoLogo />
        <Stack>
          <Typography variant="h3" color={theme.palette.primary.main}>
            Auditoría
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
};
