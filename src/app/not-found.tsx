"use client";
import { useRouter } from "next/navigation";
import { Typography, Link, Container, Grid, Button, Box } from "@mui/material";
import Image from "next/image";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <Grid container>
      <Grid item xs={6}>
        <Image
          height={1024}
          width={1024}
          src="/images/status/not-found.png"
          alt="not found image"
          style={{
            aspectRatio: "auto",
            width: "",
          }}
        />
      </Grid>
      <Grid>
        <Box>
          <Typography variant="h2">Ups!</Typography>
          <Typography>No podemos encontrar esta página</Typography>
          <Button onClick={() => router.back()}>Volver</Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotFoundPage;
