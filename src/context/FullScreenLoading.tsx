"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { FullScreenLoading } from "@/components/loaders";
import { Box, Fade } from "@mui/material";

interface FullScreenLoadingType {
  fullScreenState: boolean;
  hideFullScreen: () => void;
  showFullScreen: (message?: string | undefined | null) => void;
}

const FullScreenLoadingContext = createContext<FullScreenLoadingType>(
  {} as FullScreenLoadingType
);

interface FullScreenProviderContextType {
  children: ReactNode;
}

export const FullScreenLoadingProvider = ({
  children,
}: FullScreenProviderContextType) => {
  const [message, setMessage] = useState<string | null>();
  const [show, setShow] = useState<boolean>(false);

  const showFullScreen = (message?: string | null) => {
    setMessage(message);
    setShow(true);
  };

  const hideFullScreen = () => {
    setMessage(undefined);
    setShow(false);
  };

  return (
    <FullScreenLoadingContext.Provider
      value={{
        fullScreenState: show,
        hideFullScreen,
        showFullScreen,
      }}
    >
      {show && (
        <Box minHeight="100vh">
          <FullScreenLoading mensaje={message} />
        </Box>
      )}
      <Fade in={!show} timeout={1000}>
        <Box
          sx={{
            display: show ? "none" : "block",
            displayPrint: show ? "none" : "block",
          }}
          minHeight="100vh"
        >
          {children}
        </Box>
      </Fade>
    </FullScreenLoadingContext.Provider>
  );
};

export const useFullScreenLoading = () => useContext(FullScreenLoadingContext);
