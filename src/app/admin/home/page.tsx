"use client";
import { Icono } from "@/components/Icono";
import MainCard from "@/components/cards/MainCard";
import { CONSTANTS } from "../../../../config";
import {
  Box,
  Typography,
  Stack,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import { Calendar, Ellipsis } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomCard, MinusCard } from "./ui/CustomCard";
import { MinusArray, MinusCardProps } from "./types";
import { RoleType } from "@/types/auth";
import { CustomCardProps } from "./types";
import { useAuthStore } from "@/store";

const CARDS: CustomCardProps[] = [
  {
    color: "green",
    detallesUrl: "/",
    name: "Balance actual",
    value: "Bs. 2.400,00",
  },
  {
    color: "orange",
    detallesUrl: "/",
    name: "Crédito",
    value: "Bs. 3.150,00",
  },
];

const Home = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [roles, setRoles] = useState<RoleType[]>([]);

  const interpretarRoles = () => {
    if (user?.roles && user?.roles.length > 0) {
      setRoles(user?.roles);
    }
  };
  useEffect(() => {
    interpretarRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Stack>
      <Stack color={theme.palette.text.primary}>
        <Typography variant="h3" color="inherit">
          Bienvenid@ {user?.userData.names} {user?.userData.lastNames}
        </Typography>
        <Box height={5} />
        <Typography variant="h6" color="inherit">
          Rol actual: {user?.roleName}
        </Typography>
      </Stack>

      <Box height={20} />

      <MainCard>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">Detalles de uso</Typography>
              <Stack direction="row" spacing={2}>
                <IconButton
                  sx={{
                    border: 1,
                    borderRadius: "50%",
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Icono>
                    <Calendar />
                  </Icono>
                </IconButton>
                <IconButton
                  sx={{
                    border: 1,
                    borderRadius: "50%",
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Icono>
                    <Ellipsis />
                  </Icono>
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={CONSTANTS.gridSpacing}>
              {CARDS.map((elem, index) => (
                <Grid item xs={12} lg={6} key={`${elem.name}-${index}`}>
                  <CustomCard
                    name={elem.name}
                    value={elem.value}
                    color={elem.color}
                    detallesUrl={elem.detallesUrl}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={`${elem.icon}-${index}`}
              alignContent="center"
            >
              <MinusCard
                color={elem.color}
                icon={elem.icon}
                name={elem.name}
                value={elem.value}
              />
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <Box height={20} />
    </Stack>
  );
};

export default Home;
