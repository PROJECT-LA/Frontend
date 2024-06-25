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

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    common: {
      black: colors.grey900,
    },
    primary: {
      light: colors.primaryLight,
      main: colors.primaryMain,
      dark: colors.primaryDark,
    },
    secondary: {
      light: colors.secondaryLight,
      main: colors.secondaryMain,
      dark: colors.secondaryDark,
    },
    divider: colors.divider,
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      contrastText: colors.grey100,
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
      contrastText: colors.grey100,
      dark: colors.warningDark,
    },
    success: {
      light: colors.successLight,
      main: colors.successMain,
      contrastText: colors.grey50,
      dark: colors.successDark,
    },
    text: {
      primary: colors.grey700,
      secondary: colors.grey700,
    },
    background: {
      paper: colors.paper,
      default: colors.default,
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h6: {
      fontWeight: 500,
      color: colors.primaryDark,
      fontSize: "0.75rem",
    },
    h5: {
      fontSize: "0.875rem",
      color: colors.primaryDark,
      fontWeight: 500,
    },
    h4: {
      fontSize: "1rem",
      color: colors.primaryDark,
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.25rem",
      color: colors.primaryDark,
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.5rem",
      color: colors.primaryDark,
      fontWeight: 700,
    },
    h1: {
      fontSize: "2.125rem",
      color: colors.primaryDark,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: colors.grey900,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      color: colors.grey500,
    },
    caption: {
      fontSize: "0.75rem",
      color: colors.grey500,
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334em",
    },
    body2: {
      letterSpacing: "0em",
      fontWeight: 400,
      lineHeight: "1.5em",
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
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: colors.grey900,
          "&::placeholder": {
            color: colors.grey700,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "&::placeholder": {
            color: colors.grey700,
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
  },
});
