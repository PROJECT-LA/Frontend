import { Box, Grid, Hidden, Skeleton, Stack } from "@mui/material";
import React from "react";
import { CONSTANTS } from "../../../../../../config";

export const LoadingControlsSkeleton = () => {
  return (
    <Stack>
      <Skeleton
        height={"120px"}
        width="100%"
        sx={{ borderRadius: CONSTANTS.borderRadius }}
      />
      <Box height={5} />
      <Box>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12} md={4}>
            <Skeleton
              height="120px"
              width="100%"
              sx={{ borderRadius: CONSTANTS.borderRadius }}
            />
          </Grid>
          <Hidden mdDown>
            <Grid item md={8}>
              <Skeleton
                height="120px"
                width="100%"
                sx={{ borderRadius: CONSTANTS.borderRadius }}
              />
            </Grid>
          </Hidden>
        </Grid>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12} md={4}>
            <Skeleton
              height="120px"
              width="100%"
              sx={{ borderRadius: CONSTANTS.borderRadius }}
            />
          </Grid>
          <Hidden mdDown>
            <Grid item md={8}>
              <Skeleton
                height="120px"
                width="100%"
                sx={{ borderRadius: CONSTANTS.borderRadius }}
              />
            </Grid>
          </Hidden>
        </Grid>
        <Grid container spacing={CONSTANTS.gridSpacing}>
          <Grid item xs={12} md={4}>
            <Skeleton
              height="120px"
              width="100%"
              sx={{ borderRadius: CONSTANTS.borderRadius }}
            />
          </Grid>
          <Hidden mdDown>
            <Grid item md={8}>
              <Skeleton
                height="120px"
                width="100%"
                sx={{ borderRadius: CONSTANTS.borderRadius }}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Box>
    </Stack>
  );
};
