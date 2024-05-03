'use client'
import { Icono } from '@/components/Icono'
import Icon from '@/components/LucideIcon'
import MainCard from '@/components/cards/MainCard'
import { Constantes } from '@/config'
import {
  Box,
  Typography,
  Stack,
  Grid,
  IconButton,
  useTheme,
  Button,
} from '@mui/material'
import { ArrowRight, Calendar, Ellipsis } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import React from 'react'

const Home = () => {
  const theme = useTheme()
  return (
    <MainCard>
      <Stack spacing={Constantes.gridSpacing}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h3">Detalles de uso</Typography>
          <Stack direction="row" spacing={2}>
            <IconButton
              sx={{
                border: 1,
                borderRadius: '50%',
                borderColor: theme.palette.divider,
              }}
            >
              <Icono>
                <Calendar />
              </Icono>
            </IconButton>
            <IconButton
              sx={{
                border: 1,
                borderRadius: '50%',
                borderColor: theme.palette.divider,
              }}
            >
              <Icono>
                <Ellipsis />
              </Icono>
            </IconButton>
          </Stack>
        </Stack>

        <Grid container spacing={Constantes.gridSpacing}>
          <CustomCard
            name="Dos y dos"
            value="son cuatro"
            color="green"
            theme={theme}
            detallesUrl="/"
          />
          <CustomCard
            name="Dos y dos"
            value="son cuatro"
            color="green"
            theme={theme}
            detallesUrl="/"
          />
          <CustomCard
            name="Dos y dos"
            value="son cuatro"
            color="green"
            theme={theme}
            detallesUrl="/"
          />
          <CustomCard
            name="Dos y dos"
            value="son cuatro"
            color="green"
            theme={theme}
            detallesUrl="/"
          />
        </Grid>

        <MainCard>
          <Grid container spacing={Constantes.gridSpacing}>
            {MinusArray.map((elem: MinusCardProps, index: number) => (
              <MinusCard
                key={`${elem.icon}-${index}`}
                color={elem.color}
                icon={elem.icon}
                name={elem.name}
                value={elem.value}
              />
            ))}
          </Grid>
        </MainCard>
      </Stack>
    </MainCard>
  )
}

const MinusArray: MinusCardProps[] = [
  {
    color: '#97F5F5',
    icon: 'trending-up',
    name: 'Total ganancias',
    value: 'Bs. 2,000.30',
  },
  {
    color: '#E4CCFF',
    icon: 'trending-down',
    name: 'Total gastos',
    value: 'Bs. 4,600.30',
  },
  {
    color: '#FBDDC3',
    icon: 'wallet-cards',
    name: 'Gasto objetivo',
    value: 'Bs. 2,000.30',
  },
]

interface CustomCardProps {
  name: string
  value: string
  theme: any
  color: 'green' | 'orange' | 'purple'
  detallesUrl: string
}

const CustomCard = ({
  name,
  value,
  theme,
  color,
  detallesUrl,
}: CustomCardProps) => {
  return (
    <Grid item xs={6}>
      <Grid container>
        <Grid
          item
          xs={6}
          padding={3}
          sx={{
            backgroundColor: '#E5EDE8',
            borderTopLeftRadius: '1.4rem',
            borderBottomLeftRadius: '1.4rem',
          }}
        >
          <Stack spacing={2} color={theme.palette.primary.dark}>
            <Typography color="inherit">{name}</Typography>
            <Typography color="inherit" variant="h3">
              {value}
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: theme.palette.primary.main,
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
                right: -70,
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

interface MinusCardProps {
  name: string
  value: string
  icon: keyof typeof dynamicIconImports
  color: string
}

const MinusCard = ({ name, value, icon, color }: MinusCardProps) => {
  return (
    <Grid xs={4} alignContent="center">
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
            color: '#fff',
          }}
        >
          <Icon name={icon} />
        </Box>
        <Stack>
          <Typography>{name}</Typography>
          <Typography>{value}</Typography>
        </Stack>
      </Stack>
    </Grid>
  )
}
export default Home
