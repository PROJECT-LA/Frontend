import React from "react";
import { Box, Card, Skeleton, Stack, useTheme } from "@mui/material";
import { CONSTANTS } from "../../../../../../config";
import MainCard from "@/components/cards/MainCard";

export const SkeletonModules = () => {
  const theme = useTheme();
  return (
    <>
      <Box height={20} />
      <MainCard>
        <Stack spacing={1}>
          <Skeleton
            height="150px"
            sx={{ borderRadius: CONSTANTS.borderRadius }}
          />
          <Skeleton
            height="150px"
            sx={{ borderRadius: CONSTANTS.borderRadius }}
          />
          <Skeleton
            height="150px"
            sx={{ borderRadius: CONSTANTS.borderRadius }}
          />
        </Stack>
      </MainCard>
    </>
  );
};
