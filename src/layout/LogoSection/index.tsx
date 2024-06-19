import Link from "next/link";
import { Stack, Typography, useTheme } from "@mui/material";
import { CONSTANTS } from "../../../config";
import LogoImg from "@/assets/logo.png";
import Image from "next/image";

export const LogoCorto = () => {
  return (
    <Link href={CONSTANTS.sitePath}>
      <Image
        style={{ width: "40px", height: "40px" }}
        src={LogoImg}
        alt="logo auditorías"
      />
    </Link>
  );
};

export const Logo = () => {
  const theme = useTheme();

  return (
    <Link style={{ textDecoration: "none" }} href={CONSTANTS.sitePath}>
      <Stack direction="row" gap={1} alignItems="center">
        <Image
          style={{ width: "40px", height: "40px" }}
          src={LogoImg}
          alt="logo auditorías"
        />
        <Stack>
          <Typography variant="h3" color="secondary">
            Auditoría
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
};
