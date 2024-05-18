"use client";
import Slider from "react-slick";
import { Settings as SettingsSlider } from "react-slick";
import { Grid, useTheme, Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

// Constantes
const configuracionSlider: SettingsSlider = {
  dots: true,
  autoplay: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

export const LoginSlider = () => {
  const theme = useTheme();

  return (
    <Grid
      sx={{ position: "relative" }}
      alignItems="center"
      item
      width="100%"
      height="100%"
      lg={5}
      md={6}
      minHeight="100vh"
      bgcolor={
        theme.palette.mode === "light"
          ? theme.palette.background.paper
          : theme.palette.background.default
      }
    >
      <Image
        src="/images/login_1.svg"
        alt="Barras login"
        width={300}
        height={400}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "70%",
        }}
      />
      <Box paddingY={10}>
        <Grid container direction="column" alignContent="center">
          <Grid item xs={4} alignContent="center" width="80%">
            <Slider {...configuracionSlider}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "semi-bold",
                  }}
                >
                  Genera reportes gráficos
                </Typography>
                <Box height={8}></Box>
                <Typography variant="body1">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dolores ducimus voluptates maxime debitis numquam ratione at
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "semi-bold",
                  }}
                >
                  Mejora continua
                </Typography>
                <Box height={8}></Box>
                <Typography variant="body1">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Aspernatur dolorum architecto a esse dolores itaque,
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "semi-bold",
                  }}
                >
                  Evalúa el rendimiento
                </Typography>
                <Box height={8}></Box>
                <Typography variant="body1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Typography>
              </Box>
            </Slider>
          </Grid>

          <Grid item xs={8}>
            <Image
              src="/images/login_2.svg"
              alt="Imagen de login"
              width={300}
              height={400}
              style={{
                position: "absolute",
                bottom: 50,
                left: 0,
                width: "100%",
                height: "60%",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};
