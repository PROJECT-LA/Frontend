import React from "react";
import { Stack, Grid, Typography, Divider, Box } from "@mui/material";
import { Panel } from "react-resizable-panels";
import MainCard from "@/components/cards/MainCard";
import Image from "next/image";
import { CUControlGroupType } from "../types";

const dataGroupEspecific = [
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
  // "NUEVO",
];

interface RightPanel {
  editionControlGroup: CUControlGroupType | undefined;
}

export const RightPanel = ({ editionControlGroup }: RightPanel) => {
  return (
    <Panel minSize={60}>
      <Stack>
        {editionControlGroup !== undefined && (
          <>
            <Grid container spacing={1}>
              <Grid item xs={5.5}>
                <Stack spacing={1} height="6rem" padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Grupo
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="h4">
                      {editionControlGroup?.groupCode}
                    </Typography>
                    <Typography>{editionControlGroup?.group}</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {editionControlGroup?.groupDescription}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={0.5}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Divider orientation="vertical" />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Stack spacing={1} height="6rem" padding={1}>
                  <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Objetivo
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Typography variant="h5">
                      {editionControlGroup.objectiveCode}
                    </Typography>
                    <Typography>{editionControlGroup?.objective}</Typography>
                  </Stack>
                  <Typography variant="subtitle2">
                    {editionControlGroup?.objectiveDescription}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider />
          </>
        )}

        <Stack spacing={2}>
          {dataGroupEspecific.length === 0 ? (
            <Stack justifyContent="center" height="450px" alignItems="center">
              <Image
                src="/images/support/no-data-2.png"
                height={125}
                width={200}
                alt="No data support impaget"
              />
              <Box height={10} />
              <Typography>No hay datos que mostrar</Typography>
              <Typography variant="subtitle2">
                Por favor busque algún grupo de control.
              </Typography>
            </Stack>
          ) : (
            <>
              <MainCard>ejemplo</MainCard>
              <MainCard>ejemplo</MainCard>
              <MainCard>ejemplo</MainCard>
              <MainCard>ejemplo</MainCard>
            </>
          )}
        </Stack>
      </Stack>
    </Panel>
  );
};
