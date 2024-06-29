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
  title: string;
  text?: string;
  disablePortal?: PortalProps["disablePortal"];
  disableScrollLock?: boolean;
}

export const AlertDialog: FC<PropsWithChildren<Props>> = ({
  isOpen,
  title,
  text,
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
      <DialogTitle sx={{ p: 2 }} variant="h4">
        {title}
      </DialogTitle>

      <DialogContent>
        {text && (
          <DialogContentText>
            <Typography component={"span"}>{text}</Typography>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>{children}</DialogActions>
    </Dialog>
  );
};
