import { CONSTANTS } from "../../../../../config";
import {
  Box,
  Button,
  Grid,
  Hidden,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowRight } from "lucide-react";
import { CustomCardProps, MinusCardProps } from "../types";

const BackgroundColor = [
  { principal: "#E5EDE8", secundario: "#84B898" },
  { principal: "#E4D6F3", secundario: "#A686C4" },
  { principal: "#F5DDC8", secundario: "#E9AE79" },
];

export const CustomCard = ({
  name,
  value,
  color,
  detallesUrl,
}: CustomCardProps) => {
  const theme = useTheme();

  const indice = color === "green" ? 0 : color === "orange" ? 2 : 1;

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={7}
          padding={3}
          sx={{
            backgroundColor: BackgroundColor[indice].principal,
            borderTopLeftRadius: "1.4rem",
            borderBottomLeftRadius: "1.4rem",
            position: "relative",
            minHeight: "120px",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack color={theme.palette.grey[800]}>
              <Typography color="inherit" variant="h5">
                {name}
              </Typography>
              <Box height={5} />
              <Typography color="inherit" variant="h4">
                {value}
              </Typography>
            </Stack>
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                right: 10,
                color: theme.palette.grey[700],
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<ArrowRight />}
              >
                <Typography variant="h5" color="inherit">
                  Detalles
                </Typography>
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: BackgroundColor[indice].secundario,
            borderBottomRightRadius: "1.4rem",
            borderTopRightRadius: "1.4rem",
            "&:after": {
              border: 1.5,
              content: '""',
              borderColor: theme.palette.divider,
              borderTopRightRadius: "1.4rem",
              position: "absolute",
              width: 210,
              height: 210,
              borderRadius: "50%",
              zIndex: 1,
              top: -85,
              right: -95,
              [theme.breakpoints.down("sm")]: {
                top: -105,
                right: -140,
              },
            },
            "&:before": {
              border: 1.5,
              content: '""',
              borderColor: theme.palette.divider,
              position: "absolute",
              zIndex: 1,
              width: 210,
              height: 210,
              borderRadius: "50%",
              top: -125,
              right: -15,
              opacity: 0.5,
              [theme.breakpoints.down("sm")]: {
                top: -155,
                right: -50,
              },
            },
          }}
        ></Grid>
      </Grid>
    </>
  );
};

export const MinusCard = ({ name, value, icon, color }: MinusCardProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={CONSTANTS.gridSpacing}
    >
      <Box
        padding={1}
        sx={{
          backgroundColor: color,
          borderRadius: "1.2rem",
          padding: 1.5,
          color: "#000",
        }}
      >
        {icon}
      </Box>
      <Stack>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="h4">{value}</Typography>
      </Stack>
    </Stack>
  );
};
