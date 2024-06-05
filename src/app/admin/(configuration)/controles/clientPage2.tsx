"use client";
import MainCard from "@/components/cards/MainCard";
import { FormInputText } from "@/components/forms";
import { siteName } from "@/utils";
import {
  Button,
  Divider,
  Grid,
  Input,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { PlusCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface ControlProps {
  idTemplate: string;
}

interface SimpleSearch {
  search: string;
}
const ControlsPage2 = ({ idTemplate }: ControlProps) => {
  const { control } = useForm<SimpleSearch>({
    defaultValues: {
      search: "",
    },
  });

  return (
    <>
      <title>{`Controles - ${siteName()}`}</title>
      <MainCard padding={false} radius="0.4rem">
        <Grid container direction="row">
          <Grid item xs={4} borderRight={1}>
            <Stack padding={1} height="5rem">
              <FormInputText
                id="search"
                name="search"
                control={control}
                label="Buscar"
              />
            </Stack>
            <Divider />
            <List>
              {new Array(10).fill(null).map((_, index) => (
                <ListItem key={`list-item-${index}`}>
                  <Button fullWidth variant="outlined">
                    Ejemplo 1
                  </Button>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={8}>
            <Stack>
              <Stack
                padding={2}
                height="5rem"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h3">Controles</Typography>
                <Stack direction="row">
                  <Button variant="contained" startIcon={<PlusCircle />}>
                    Añadir control
                  </Button>
                </Stack>
              </Stack>
              <Divider />

              <Stack padding={1} spacing={2}>
                <MainCard>ejemplo</MainCard>
                <MainCard>ejemplo</MainCard>
                <MainCard>ejemplo</MainCard>
                <MainCard>ejemplo</MainCard>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default ControlsPage2;
