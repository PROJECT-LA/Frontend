"use client";
import { useRouter } from "next/navigation";
import {
  Typography,
  Link,
  Stack,
  Grid,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import Image from "next/image";

const NotFoundPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = theme.breakpoints.up("md");

  return (
    <Grid container height="100vh">
      <Grid item xs={12} md={6}>
        <Box
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            height={300}
            width={400}
            src="/images/status/not-found.png"
            alt="not found image"
            style={{
              aspectRatio: "auto",
              objectFit: "cover",
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          display="flex"
          height="100%"
          paddingX={5}
          justifyContent={mdUp ? "center" : "start"}
          alignItems={mdUp ? "center" : "start"}
        >
          <Stack alignItems="start">
            <Typography variant="h1">¡Esta página no existe!</Typography>
            <Box height={5} />
            <Typography>No podemos encontrar esta página</Typography>

            <Box height={20} />
            <Button
              variant="contained"
              onClick={() => {
                router.back();
                router.back();
              }}
            >
              Volver
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotFoundPage;
