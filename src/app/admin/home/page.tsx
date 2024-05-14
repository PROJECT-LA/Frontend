'use client'
import { Icono } from '@/components/Icono'
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
import React, { useEffect, useState } from 'react'
import { CustomCard, MinusCard } from './ui/CustomCard'
import { MinusArray, MinusCardProps } from './types'

import { CustomCardProps } from './types'
import { obtenerNombreRolActual } from '@/utils/utilidades'
import { useAuth } from '@/context/AuthProvider'
import { RoleType } from '@/types/login'

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
  const { usuario, setRolUsuario, rolUsuario } = useAuth()
  const [roles, setRoles] = useState<RoleType[]>([])

  const interpretarRoles = () => {
    if (usuario?.roles && usuario?.roles.length > 0) {
      setRoles(usuario?.roles)
    }
  }
  /// Interpretando roles desde estado
  useEffect(() => {
    interpretarRoles()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  return (
    <Stack>
      <Stack>
        <Typography variant="h2">Bienvenid@ Alexander Nina</Typography>
        <Box height={5} />
        <Typography variant="h4">
          {obtenerNombreRolActual(roles, rolUsuario?.id ?? '0')}
        </Typography>
      </Stack>

      <Box height={20} />

      <MainCard>
        <Grid container spacing={Constantes.gridSpacing}>
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={Constantes.gridSpacing}>
              {CARDS.map((elem, index) => (
                <Grid item xs={12} lg={6} key={`${elem.name}-${index}`}>
                  <CustomCard
                    name={elem.name}
                    value={elem.value}
                    color={elem.color}
                    detallesUrl={elem.detallesUrl}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MainCard>

      <Box height={20} />

      <MainCard>
        <Grid container spacing={Constantes.gridSpacing}>
          {MinusArray.map((elem: MinusCardProps, index: number) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={`${elem.icon}-${index}`}
              alignContent="center"
            >
              <MinusCard
                color={elem.color}
                icon={elem.icon}
                name={elem.name}
                value={elem.value}
              />
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <Box height={20} />
    </Stack>
  )
}

export default Home
