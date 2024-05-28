import { useState, useRef, useEffect, ChangeEvent } from "react";
import Link from "next/link";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import Transitions from "@/components/Transitions";

import NotificationList from "./NotificationList";

// assets
import { Bell } from "lucide-react";

// notification status options
const status = [
  {
    value: "all",
    label: "All Notification",
  },
  {
    value: "new",
    label: "New",
  },
  {
    value: "unread",
    label: "Unread",
  },
  {
    value: "other",
    label: "Other",
  },
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<HTMLDivElement | null>(null);

  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event?.target?.value) setValue(event?.target.value);
  };

  return (
    <>
      <Box>
        <ButtonBase
          sx={{
            padding: 1,
            borderRadius: "50%",
            transition: "all .2s ease-in-out",
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: 1,
            borderColor: theme.palette.divider,
            position: "relative",
          }}
        >
          <Bell size="1.5rem" />
          <Box
            sx={{
              position: "absolute",
              display: "grid",
              placeItems: "center",
              top: -5,
              right: -5,
              width: 20,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: "100%",
            }}
          >
            <Typography color={"white"} variant="caption">
              3
            </Typography>
          </Box>
        </ButtonBase>
      </Box>

      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [matchesXs ? 5 : 0, 20],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            position={matchesXs ? "top" : "top-right"}
            in={open}
            {...TransitionProps}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <Card>
                  <Typography>Elemento Card Notificación</Typography>
                </Card>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
