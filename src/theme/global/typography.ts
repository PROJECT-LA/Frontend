import { TypographyOptions } from '@mui/material/styles/createTypography'
import { BaseTema, EsquemaColor } from '@/types/temaTypes'
import { Constantes } from '../../config'

export const typography = (
  modo: BaseTema,
  color: EsquemaColor
): TypographyOptions => {
  if (modo === 'light') {
    return {
      fontFamily: Constantes.letra,
      h6: {
        fontWeight: 500,
        color: color.primaryDark,
        fontSize: '0.75rem',
      },
      h5: {
        fontSize: '0.875rem',
        color: color.primaryDark,
        fontWeight: 500,
      },
      h4: {
        fontSize: '1rem',
        color: color.primaryDark,
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.25rem',
        color: color.primaryDark,
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.5rem',
        color: color.primaryDark,
        fontWeight: 700,
      },
      h1: {
        fontSize: '2.125rem',
        color: color.primaryDark,
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: color.grey900,
      },
      subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: color.grey500,
      },
      caption: {
        fontSize: '0.75rem',
        color: color.grey500,
        fontWeight: 400,
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334em',
      },
      body2: {
        letterSpacing: '0em',
        fontWeight: 400,
        lineHeight: '1.5em',
      },
      button: {
        textTransform: 'capitalize',
      },
    }
  } else {
    return {
      fontFamily: Constantes.letra,
      h6: {
        fontWeight: 500,
        color: color.darkTextPrimary,
        fontSize: '0.75rem',
      },
      h5: {
        fontSize: '0.875rem',
        color: color.darkTextPrimary,
        fontWeight: 500,
      },
      h4: {
        fontSize: '1rem',
        color: color.darkTextPrimary,
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.25rem',
        color: color.darkTextPrimary,
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.5rem',
        color: color.darkTextPrimary,
        fontWeight: 700,
      },
      h1: {
        fontSize: '2.125rem',
        color: color.darkTextPrimary,
        fontWeight: 700,
      },
      subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: color.darkTextSecondary,
      },
      subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: color.darkTextSecondary,
      },
      caption: {
        fontSize: '0.75rem',
        color: color.darkTextSecondary,
        fontWeight: 400,
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334em',
        color: color.darkTextSecondary,
      },
      body2: {
        letterSpacing: '0em',
        fontWeight: 400,
        lineHeight: '1.5em',
        color: color.darkTextSecondary,
      },
      button: {
        textTransform: 'capitalize',
      },
    }
  }
}
