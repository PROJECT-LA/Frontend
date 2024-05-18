import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { TransitionZoom } from "../Animations";
import { PortalProps } from "@mui/base/Portal";
import { CONSTANTS } from "../../../config";

interface Props {
  isOpen: boolean;
  titulo: string;
  texto: string;
  disablePortal?: PortalProps["disablePortal"];
  disableScrollLock?: boolean;
}

export const AlertDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  titulo,
  texto,
  children,
  disablePortal,
  disableScrollLock,
}) => {
  return (
    <Dialog
      sx={{
        borderRadius: CONSTANTS.borderRadius,
      }}
      open={isOpen}
      TransitionComponent={TransitionZoom}
      disablePortal={disablePortal}
      disableScrollLock={disableScrollLock}
    >
      <DialogTitle sx={{ m: 1, p: 2 }} variant="h4">
        {titulo}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component={"span"}>{texto}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  );
};
