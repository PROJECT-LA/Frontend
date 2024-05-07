import Icon from '@/components/LucideIcon'
import { Constantes } from '@/config'
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { CustomCardProps, MinusCardProps } from '../types'
import Grafico from './Grafico'

const BackgroundColor = [
  { principal: '#E5EDE8', secundario: '#84B898' },
  { principal: '#E4D6F3', secundario: '#A686C4' },
  { principal: '#F5DDC8', secundario: '#E9AE79' },
]

export const CustomCard = ({
  name,
  value,
  color,
  detallesUrl,
}: CustomCardProps) => {
  const theme = useTheme()

  const indice = color === 'green' ? 0 : color === 'orange' ? 2 : 1

  return (
    <Grid item xs={6}>
      <Grid container>
        <Grid
          item
          xs={6}
          padding={3}
          sx={{
            backgroundColor: BackgroundColor[indice].principal,
            borderTopLeftRadius: '1.4rem',
            borderBottomLeftRadius: '1.4rem',
            position: 'relative',
            minHeight: '200px',
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack spacing={2} color={theme.palette.grey[800]}>
              <Typography color="inherit" variant="h3">
                {name}
              </Typography>
              <Typography color="inherit" variant="h2">
                {value}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: '250px',
                width: '300px',
                position: 'absolute',
                display: 'flex',
                alignItems: 'baseline',
                bottom: -50,
                right: -80,
              }}
            >
              <Grafico />
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: BackgroundColor[indice].secundario,
            borderBottomRightRadius: '1.4rem',
            borderTopRightRadius: '1.4rem',
            '&:after': {
              border: 1.5,
              content: '""',
              borderColor: theme.palette.divider,
              borderTopRightRadius: '1.4rem',
              position: 'absolute',
              width: 210,
              height: 210,
              borderRadius: '50%',
              zIndex: 1,
              top: -85,
              right: -95,
              [theme.breakpoints.down('sm')]: {
                top: -105,
                right: -140,
              },
            },
            '&:before': {
              border: 1.5,
              content: '""',
              borderColor: theme.palette.divider,
              position: 'absolute',
              zIndex: 1,
              width: 210,
              height: 210,
              borderRadius: '50%',
              top: -125,
              right: -15,
              opacity: 0.5,
              [theme.breakpoints.down('sm')]: {
                top: -155,
                right: -50,
              },
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#fff',
                color: theme.palette.primary.dark,
              }}
              endIcon={<ArrowRight />}
            >
              Detalles
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export const MinusCard = ({ name, value, icon, color }: MinusCardProps) => {
  return (
    <Grid item xs={4} alignContent="center">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={Constantes.gridSpacing}
      >
        <Box
          padding={1}
          sx={{
            backgroundColor: color,
            borderRadius: '0.5rem',
            padding: 1,
            color: '#fff',
          }}
        >
          <Icon name={icon} fontSize="1.5rem" />
        </Box>
        <Stack>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="h3">{value}</Typography>
        </Stack>
      </Stack>
    </Grid>
  )
}
