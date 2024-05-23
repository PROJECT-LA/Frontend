import { EsquemaColor } from "./types";
import { createTheme } from "@mui/material";
import { globalPalette, customization, globalTypography } from "./global";

export const colors: EsquemaColor = {
  // text variants
  darkTextPrimary: "#e5f3fb",
  darkTextSecondary: "#e7ecf0",

  // paper & background
  paper: "#fff",
  default: "#F0EDE6",

  darkPaper: "#262833",
  darkDefault: "#242631",

  // divider
  divider: "#fff",
  dividerDark: "#393B44",

  // primary
  primaryLight: "#e5f3fb",
  primaryMain: "#84B898",
  primaryDark: "#4F6F52",

  // primary dark
  darkPrimaryLight: "#e5f3fb",
  darkPrimaryMain: "#84B898",
  darkPrimaryDark: "#4F6F52",

  // secondary
  secondaryLight: "#E4D6F3",
  secondaryMain: "#A686C4",
  secondaryDark: "#707a82",

  // secondary dark
  darkSecondaryLight: "#E4D6F3",
  darkSecondaryMain: "#A686C4",
  darkSecondaryDark: "#7c4dff",

  // success
  successLight: "#dffff3",
  successMain: "#4bd08b",
  successDark: "#4bd08b",

  // info
  infoMain: "#46caeb",
  infoLight: "#e1f5fa",
  infoDark: "#46caeb",

  // error
  errorLight: "#ffede9",
  errorMain: "#fb977d",
  errorDark: "#fb977d",

  // orange
  orangeLight: "#fbe9e7",
  orangeMain: "#ffab91",
  orangeDark: "#d84315",

  // warning
  warningLight: "#fff6ea",
  warningMain: "#f8c076",
  warningDark: "#f8c076",

  // grey
  grey50: "#f8fafc",
  grey100: "#eef2f6",
  grey200: "#e3e8ef",
  grey300: "#cdd5df",
  grey500: "#697586",
  grey600: "#4b5565",
  grey700: "#364152",
  grey900: "#121926",
};

const lightPalette = globalPalette("light", colors);
const lightStyleComponents = customization("light", colors);
const lightLetters = globalTypography("light", colors);

const darkPalette = globalPalette("dark", colors);
const darkStyleComponents = customization("dark", colors);
const darkLetters = globalTypography("dark", colors);

export const lightTheme = createTheme({
  palette: lightPalette,
  components: lightStyleComponents,
  typography: lightLetters,
});

export const darkTheme = createTheme({
  palette: darkPalette,
  components: darkStyleComponents,
  typography: darkLetters,
});
