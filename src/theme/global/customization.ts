import { Constantes } from '@/config'
import { BaseTema, EsquemaColor } from '@/types/temaTypes'

export const customizacion = (modo: BaseTema, color: EsquemaColor): any => {
  if (modo === 'light') {
    return {
      MuiButton: {
        styleOverrides: {
          root: {
            // color: color.grey100,
            fontWeight: 500,
            fontSize: '1rem',
            borderRadius: `${Constantes.borderRadius}rem`,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: `${Constantes.borderRadius}px`,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: '24px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            color: color.darkTextPrimary,
            paddingTop: '10px',
            paddingBottom: '10px',
            '&.Mui-selected': {
              color: color.primaryLight,
              backgroundColor: color.primaryLight,
              '&:hover': {
                backgroundColor: color.primaryLight,
              },
              '& .MuiListItemIcon-root': {
                color: color.primaryDark,
              },
            },
            '&:hover': {
              backgroundColor: color.secondaryLight,
              color: color.primaryMain,
              '& .MuiListItemIcon-root': {
                color: color.primaryDark,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: color.darkTextPrimary,
            minWidth: '36px',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: color.grey900,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          color: color.grey900,
          input: {
            color: color.grey900,
            '&::placeholder': {
              color: color.darkTextSecondary,
              fontSize: '0.875rem',
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: color.grey300,
            },
          },
          mark: {
            backgroundColor: color.paper,
            width: '4px',
          },
          valueLabel: {
            color: color.primaryLight,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            '&.MuiChip-deletable .MuiChip-deleteIcon': {
              color: 'inherit',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: color.paper,
            background: color.grey700,
          },
        },
      },
    }
  } else {
    return {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: '1rem',
            borderRadius: `${Constantes.borderRadius}rem`,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: `${Constantes.borderRadius}px`,
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px',
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: '24px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            color: color.darkTextPrimary,
            paddingTop: '10px',
            paddingBottom: '10px',
            '&.Mui-selected': {
              color: color.secondaryDark,
              backgroundColor: color.secondaryDark,
              '&:hover': {
                backgroundColor: color.secondaryDark,
              },
              '& .MuiListItemIcon-root': {
                color: color.secondaryDark,
              },
            },
            '&:hover': {
              backgroundColor: color.secondaryDark,
              color: color.secondaryDark,
              '& .MuiListItemIcon-root': {
                color: color.secondaryDark,
              },
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: color.darkTextPrimary,
            minWidth: '36px',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: color.grey900,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          color: color.grey200,
          input: {
            color: color.grey200,
            '&::placeholder': {
              color: color.darkTextSecondary,
              fontSize: '0.875rem',
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              color: color.grey300,
            },
          },
          mark: {
            backgroundColor: color.paper,
            width: '4px',
          },
          valueLabel: {
            color: color.primaryLight,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            '&.MuiChip-deletable .MuiChip-deleteIcon': {
              color: 'inherit',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: color.paper,
            background: color.grey700,
          },
        },
      },
    }
  }
}
