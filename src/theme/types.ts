export type ThemeMode =
  | "primary-light"
  | "primary-dark"
  | "secondary-light"
  | "secondary-dark"
  | "tertiary-light"
  | "tertiary-dark";

export interface tema {
  nombre: ThemeMode;
  color: string;
}

export type BaseTema = "light" | "dark";

export interface EsquemaColor {
  paper: string;
  default: string;

  divider: string;
  dividerDark: string;

  infoMain: string;
  infoLight: string;
  infoDark: string;

  primaryLight: string;
  primaryMain: string;
  primaryDark: string;

  secondaryLight: string;
  secondaryMain: string;
  secondaryDark: string;

  successLight: string;
  successMain: string;
  successDark: string;

  errorLight: string;
  errorMain: string;
  errorDark: string;

  orangeLight: string;
  orangeMain: string;
  orangeDark: string;

  warningLight: string;
  warningMain: string;
  warningDark: string;

  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey900: string;

  darkPaper: string;
  darkDefault: string;

  darkPrimaryLight: string;
  darkPrimaryMain: string;
  darkPrimaryDark: string;

  darkSecondaryLight: string;
  darkSecondaryMain: string;
  darkSecondaryDark: string;

  darkTextPrimary: string;
  darkTextSecondary: string;
}
