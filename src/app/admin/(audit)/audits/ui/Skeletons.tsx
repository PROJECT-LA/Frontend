import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

export const CustomTabSkeleton = () => {
  return (
    <Stack>
      <Stack direction="row" height="45px" spacing={3}>
        <Skeleton width="170px" />
        <Skeleton width="300px" />
      </Stack>
      <Stack height="100px">
        <Skeleton width="100%" height="100%" />
      </Stack>
      <Stack height="100px">
        <Skeleton width="100%" height="100%" />
      </Stack>
      <Stack height="100px">
        <Skeleton width="100%" height="100%" />
      </Stack>
      <Stack height="100px">
        <Skeleton width="100%" height="100%" />
      </Stack>
    </Stack>
  );
};
