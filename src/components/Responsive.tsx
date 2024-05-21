"use client";
import React from "react";
import { CONSTANTS } from "../../config";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const Responsive = () => {
  const theme = useTheme();
  const matchUpXs = useMediaQuery(theme.breakpoints.up("xs"));
  const matchUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchUpXl = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <>
      {CONSTANTS.appEnv === "development" && (
        <Box
          sx={{
            width: "25px",
            height: "25px",
            position: "fixed",
            bottom: 10,
            right: 10,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            color: "white",
          }}
        >
          <Typography color="inherit" variant="subtitle2">
            {matchUpXl
              ? "xl"
              : matchUpLg
              ? "lg"
              : matchUpMd
              ? "md"
              : matchUpSm
              ? "sm"
              : "xs"}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default Responsive;
