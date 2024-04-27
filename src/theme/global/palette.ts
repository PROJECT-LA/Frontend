import { PaletteOptions } from '@mui/material'
import { EsquemaColor, BaseTema } from '@/types/temaTypes'

export const paleta = (modo: BaseTema, color: EsquemaColor): PaletteOptions => {
  if (modo === 'light') {
    return {
      mode: modo,
      common: {
        black: color.grey900,
      },
      primary: {
        light: color.primaryLight,
        main: color.primaryMain,
        dark: color.primaryDark,
      },
      secondary: {
        light: color.secondaryLight,
        main: color.secondaryMain,
        dark: color.secondaryDark,
      },
      divider: color.divider,
      error: {
        light: color.errorLight,
        main: color.errorMain,
        contrastText: color.grey100,
        dark: color.errorDark,
      },
      info: {
        contrastText: color.grey50,
        main: color.infoMain,
        light: color.infoLight,
        dark: color.infoDark,
      },
      warning: {
        light: color.warningLight,
        main: color.warningMain,
        contrastText: color.grey100,
        dark: color.warningDark,
      },
      success: {
        light: color.successLight,
        main: color.successMain,
        contrastText: color.grey50,
        dark: color.successDark,
      },
      text: {
        primary: color.grey900,
        secondary: color.grey700,
      },
      background: {
        paper: color.paper,
        default: color.default,
      },
    }
  } else {
    return {
      mode: modo,
      common: {
        black: color.grey900,
      },
      primary: {
        contrastText: color.grey50,
        light: color.darkPrimaryLight,
        main: color.darkPrimaryMain,
        dark: color.darkPrimaryDark,
      },
      secondary: {
        contrastText: color.grey50,
        light: color.darkSecondaryLight,
        main: color.darkSecondaryMain,
        dark: color.darkSecondaryDark,
      },
      divider: color.dividerDark,
      error: {
        light: color.errorLight,
        main: color.errorMain,
        contrastText: color.grey50,
        dark: color.errorDark,
      },
      info: {
        contrastText: color.grey50,
        main: color.infoMain,
        light: color.infoLight,
        dark: color.infoDark,
      },
      warning: {
        light: color.warningLight,
        main: color.warningMain,
        contrastText: color.grey50,
        dark: color.warningDark,
      },
      success: {
        light: color.successLight,
        main: color.successMain,
        contrastText: color.grey50,
        dark: color.successDark,
      },
      text: {
        primary: color.darkTextPrimary,
        secondary: color.darkTextSecondary,
      },
      background: {
        paper: color.darkPaper,
        default: color.darkDefault,
      },
    }
  }
}
