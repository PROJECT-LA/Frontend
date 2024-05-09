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
} from '@mui/material'
import { Calendar, Ellipsis } from 'lucide-react'
import React from 'react'
import { CustomCard, MinusCard } from './ui/CustomCard'
import { MinusArray, MinusCardProps } from './types'

import { CustomCardProps } from './types'

const CARDS: CustomCardProps[] = [
  {
    color: 'green',
    detallesUrl: '/',
    name: 'Balance actual',
    value: 'Bs. 2.400,00',
  },
  {
    color: 'orange',
    detallesUrl: '/',
    name: 'Crédito',
    value: 'Bs. 3.150,00',
  },
  {
    color: 'purple',
    detallesUrl: '/',
    name: 'Débito',
    value: 'Bs. 4.020,00',
  },
  {
    color: 'green',
    detallesUrl: '/',
    name: 'prueba 4',
    value: 'Bs. 2.400,00',
  },
]

const Home = () => {
  const theme = useTheme()
  return (
    <Stack>
      <Stack>
        <Typography variant="h2">Bienvenid@ Alexander Nina</Typography>
        <Box height={5} />
        <Typography variant="h4">Administrador</Typography>
      </Stack>

      <Box height={20} />

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

          <Box>
            <Grid container spacing={Constantes.gridSpacing}>
              {CARDS.map((elem, index) => (
                <CustomCard
                  key={`${elem.name}-${index}`}
                  name={elem.name}
                  value={elem.value}
                  color={elem.color}
                  detallesUrl={elem.detallesUrl}
                />
              ))}
            </Grid>
          </Box>
        </Stack>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <MinusCard
              key={`${elem.icon}-${index}`}
              color={elem.color}
              icon={elem.icon}
              name={elem.name}
              value={elem.value}
            />
          ))}
        </Stack>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <MinusCard
              key={`${elem.icon}-${index}`}
              color={elem.color}
              icon={elem.icon}
              name={elem.name}
              value={elem.value}
            />
          ))}
        </Stack>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <MinusCard
              key={`${elem.icon}-${index}`}
              color={elem.color}
              icon={elem.icon}
              name={elem.name}
              value={elem.value}
            />
          ))}
        </Stack>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <MinusCard
              key={`${elem.icon}-${index}`}
              color={elem.color}
              icon={elem.icon}
              name={elem.name}
              value={elem.value}
            />
          ))}
        </Stack>
      </MainCard>
    </Stack>
  )
}

export default Home
