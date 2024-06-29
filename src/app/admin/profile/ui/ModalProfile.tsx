import { LinealLoader } from "@/components/loaders";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Input,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { UploadCloud, X } from "lucide-react";
import { keyframes } from "@mui/material";
import React, { useRef, useState } from "react";
import { CONSTANTS } from "../../../../../config";
import { toast } from "sonner";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

interface ModalProfile {
  acceptAction: () => void;
  cancelAction: () => void;
  fileList: File[];
  setFileList: (data: File[]) => void;
  fileRemove: () => void;
}

export const ModalProfile = ({
  cancelAction,
  acceptAction,
  fileList,
  setFileList,
  fileRemove,
}: ModalProfile) => {
  const theme = useTheme();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const onDragEnter = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("dragover");
    }
  };
  const onDragLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };
  const onDrop = () => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove("dragover");
    }
  };
  const onFileDrop = (e: any) => {
    const newFile = e.target.files[0];
    if (newFile) {
      if (newFile.size > 5 * 1024 * 1024) {
        toast.error("El archivo pesa más de 5mb no se puede continuar.");
      }
      const updatedList: any = [...fileList, newFile];
      setFileList(updatedList);
    }
  };

  const handleSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileList.length > 0) {
      const formData = new FormData();
      formData.append("file", fileList[0]);
      // Services at endpoint
    }
  };

  return (
    <form
      encType="multipart/form-data"
      id="formImage"
      onSubmit={handleSubmitImage}
    >
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Box height={"5px"} />

          {fileList.length === 0 ? (
            <Box
              position="relative"
              width="100%"
              height="100px"
              borderRadius={4}
              display="flex"
              justifyContent="center"
              alignItems="center"
              border="dashed"
              borderColor={theme.palette.grey[500]}
              sx={{
                "&:hover": {
                  animation: `${pulse}  1.5s infinite`,
                  cursor: "pointer",
                },
              }}
              ref={wrapperRef}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <Stack
                spacing={2}
                zIndex={0}
                justifyContent="center"
                alignItems="center"
              >
                <UploadCloud size={35} color={theme.palette.primary.main} />
                <p>Arrastra o selecciona una imagen aquí</p>
              </Stack>
              <input
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                type="file"
                id="imageFile"
                name="imageFile"
                onChange={onFileDrop}
              />
            </Box>
          ) : (
            <Stack
              height="100px"
              direction="row"
              justifyContent="space-between"
              paddingX={1}
              paddingY={1}
              border={1}
              borderRadius={2}
            >
              <Stack direction="row" spacing={2}>
                <img
                  style={{ width: "82px", borderRadius: 5, height: "82px" }}
                  src={URL.createObjectURL(fileList[0])}
                />
                <Stack spacing={1}>
                  <Typography>{fileList[0].name}</Typography>
                  <Typography>
                    Tamaño: {(fileList[0].size / 1024).toFixed()} Kb
                  </Typography>
                </Stack>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={() => fileRemove()}>
                  <X />
                </IconButton>
              </Box>
            </Stack>
          )}
          <Box height={"5px"} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          py: 1,
          px: 2,
          justifyContent: {
            lg: "flex-end",
            md: "flex-end",
            xs: "center",
            sm: "center",
          },
        }}
      >
        <Button variant={"outlined"} onClick={cancelAction}>
          Cancelar
        </Button>
        <Button variant={"contained"} type="button" onClick={acceptAction}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};
