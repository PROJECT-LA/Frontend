import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";
import { colors } from "./colors";
import { CONSTANTS } from "../../config";

const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    common: {
      black: colors.grey900,
    },
    primary: {
      contrastText: colors.grey50,
      light: colors.darkPrimaryLight,
      main: colors.darkPrimaryMain,
      dark: colors.darkPrimaryDark,
    },
    secondary: {
      contrastText: colors.grey50,
      light: colors.darkSecondaryLight,
      main: colors.darkSecondaryMain,
      dark: colors.darkSecondaryDark,
    },
    divider: colors.dividerDark,
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      contrastText: colors.grey50,
      dark: colors.errorDark,
    },
    info: {
      contrastText: colors.grey50,
      main: colors.infoMain,
      light: colors.infoLight,
      dark: colors.infoDark,
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      contrastText: colors.grey50,
      dark: colors.warningDark,
    },
    success: {
      light: colors.successLight,
      main: colors.successMain,
      contrastText: colors.grey50,
      dark: colors.successDark,
    },
    text: {
      primary: colors.darkTextPrimary,
      secondary: colors.darkTextSecondary,
    },
    background: {
      paper: colors.darkPaper,
      default: colors.darkDefault,
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h6: {
      fontWeight: 500,
      color: colors.darkTextPrimary,
      fontSize: "0.75rem",
    },
    h5: {
      fontSize: "0.875rem",
      color: colors.darkTextPrimary,
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      color: colors.darkTextPrimary,
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      color: colors.darkTextPrimary,
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      color: colors.darkTextPrimary,
      fontWeight: 700,
    },
    h1: {
      fontSize: "2.125rem",
      color: colors.darkTextPrimary,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: colors.darkTextSecondary,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      color: colors.darkTextSecondary,
    },
    caption: {
      fontSize: "0.75rem",
      color: colors.darkTextSecondary,
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334em",
      color: colors.darkTextSecondary,
    },
    body2: {
      letterSpacing: "0em",
      fontWeight: 400,
      lineHeight: "1.5em",
      color: colors.darkTextSecondary,
    },
    button: {
      textTransform: "capitalize",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        rounded: {
          borderRadius: `${CONSTANTS.borderRadius}px`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.darkDefault,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          color: colors.grey200,
          "&::placeholder": {
            color: colors.darkTextSecondary,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: colors.grey300,
          },
        },
        mark: {
          backgroundColor: colors.paper,
          width: "4px",
        },
        valueLabel: {
          color: colors.primaryLight,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: colors.paper,
          background: colors.grey700,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          background: colors.darkDefault,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: colors.darkDefault,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          background: colors.darkDefault,
        },
      },
    },
  },
});
