"use client";
import { Card, Grid, useMediaQuery, useTheme } from "@mui/material";
import LightLogin from "@/assets/login/light.jpeg";
import DarkLogin from "@/assets/login/dark.jpeg";
import Box from "@mui/material/Box";
import Image from "next/image";
import { CONSTANTS } from "../../../config";
import { LoginForm } from "./ui";

export default function LoginPage() {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      height="100vh"
      paddingX={lgUp ? 10 : xlUp ? 15 : smUp ? 5 : 0}
      paddingY={lgUp ? 3 : xlUp ? 10 : smUp ? 1 : 0}
      display="flex"
      justifyContent="center"
    >
      <Card
        sx={{
          borderRadius: `${smUp ? "1rem" : 0}`,
          height: "100%",
          boxShadow: CONSTANTS.boxShadow,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            lg={7}
            xl={8}
            zIndex={1}
            height={lgUp ? "100%" : "10vh"}
          >
            {theme.palette.mode === "light" ? (
              <Image
                src={LightLogin}
                alt="light login background"
                style={{
                  width: "100%",
                  height: "100%",
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
          <Grid item xs={12} lg={5} xl={4} position="relative">
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
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                right: -10,
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                backgroundColor: "#FDFFC2",
                filter: "blur(160px)",
              }}
            />
            <Box
              minHeight="700px"
              sx={{
                py: { xs: 2, lg: 5 },
                px: { xs: 3, lg: 7, xl: 4 },
              }}
            >
              <LoginForm />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
