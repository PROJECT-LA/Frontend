import { Box, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  mensaje?: string | undefined | null;
}

export const FullScreenLoading: FC<Props> = ({ mensaje }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {mensaje ? (
        <Typography variant={"subtitle2"}>{mensaje}</Typography>
      ) : null}
      <Box width={"10px"} />
      <span className="loader"></span>
      <style>{`
      .loader {
        box-sizing: border-box;
        position: relative;
        width: 48px;
        height: 48px;
        animation: spin 1s linear infinite;
      }
      .loader:after, .loader:before {
        content: "";
        width: 24px;
        height: 24px;
        position: absolute;
        border-radius: 50%;
        background: #FF3D00;
        animation: spin 1s linear infinite;
        transform-origin: 0px 100%;
      }
      .loader:before {
        transform-origin: 0 50%;
        background: #fff;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      `}</style>
    </Box>
  );
};
