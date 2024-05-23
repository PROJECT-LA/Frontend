import { CONSTANTS } from "../../../config";
import { BaseTema, EsquemaColor } from "../types";

export const customization = (modo: BaseTema, color: EsquemaColor): any => {
  if (modo === "light") {
    return {
      MuiButton: {
        styleOverrides: {
          root: {
            // color: color.grey100,
            fontWeight: 500,
            fontSize: "1rem",
            borderRadius: `${CONSTANTS.borderRadius}rem`,
          },
        },
      },
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

      MuiInputBase: {
        styleOverrides: {
          color: color.grey900,
          input: {
            color: color.grey900,
            "&::placeholder": {
              color: color.darkTextSecondary,
              fontSize: "0.875rem",
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: color.grey300,
            },
          },
          mark: {
            backgroundColor: color.paper,
            width: "4px",
          },
          valueLabel: {
            color: color.primaryLight,
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
            color: color.paper,
            background: color.grey700,
          },
        },
      },
    };
  } else {
    return {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: "1rem",
            borderRadius: `${CONSTANTS.borderRadius}rem`,
          },
        },
      },
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

      MuiInputBase: {
        styleOverrides: {
          color: color.grey200,
          input: {
            color: color.grey200,
            "&::placeholder": {
              color: color.darkTextSecondary,
              fontSize: "0.875rem",
            },
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: color.grey300,
            },
          },
          mark: {
            backgroundColor: color.paper,
            width: "4px",
          },
          valueLabel: {
            color: color.primaryLight,
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
            color: color.paper,
            background: color.grey700,
          },
        },
      },
    };
  }
};
