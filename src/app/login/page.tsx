"use client";
import { Card, Grid, useTheme } from "@mui/material";
import LightLogin from "@/assets/login/light.jpeg";
import DarkLogin from "@/assets/login/dark.jpeg";
import Box from "@mui/material/Box";
import Image from "next/image";
import { CONSTANTS } from "../../../config";
import { LoginForm } from "./ui";

export default function LoginPage() {
  const theme = useTheme();

  return (
    <Box
      height="100vh"
      paddingX={20}
      paddingY={10}
      display="flex"
      justifyContent="center"
    >
      <Card
        sx={{
          borderRadius: "1rem",
          height: "100%",
          boxShadow: CONSTANTS.boxShadow,
        }}
      >
        <Grid container borderRadius={CONSTANTS.borderRadius}>
          <Grid item xs={8} zIndex={1}>
            {theme.palette.mode === "light" ? (
              <Image
                src={LightLogin}
                alt="light login background"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Image
                src={DarkLogin}
                alt="light login background"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Grid>
          <Grid item xs={4} position="relative" paddingX={10} paddingY={5}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: -10,
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#94FFD8",
                filter: "blur(100px)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: -10,
                width: "170px",
                height: "170px",
                borderRadius: "50%",
                backgroundColor: "#FF76CE",
                filter: "blur(160px)",
              }}
            />
            <LoginForm />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
