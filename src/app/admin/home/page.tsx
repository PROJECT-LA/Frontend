'use client'
import { Icono } from '@/components/Icono'
import MainCard from '@/components/cards/MainCard'
import { Constantes } from '@/config'
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  IconButton,
  useTheme,
  Button,
  styled,
} from '@mui/material'
import { ArrowRight, Calendar, Ellipsis } from 'lucide-react'
import React from 'react'

const Home = () => {
  const theme = useTheme()
  return (
    <MainCard>
      <Stack spacing={5}>
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

        <Stack direction="row" spacing={5}>
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
              <Stack spacing={2}>
                <Typography>Balance de uso: </Typography>
                <Typography variant="h3">35,200</Typography>
              </Stack>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#84B898',
                borderTopRightRadius: '1.4rem',
                borderBottomRightRadius: '1.4rem',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  background: theme.palette.primary.light,
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
                  content: '""',
                  position: 'absolute',
                  zIndex: 1,
                  width: 210,
                  height: 210,
                  background: theme.palette.primary.dark,
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
                  sx={{ backgroundColor: '#fff' }}
                  endIcon={<ArrowRight />}
                >
                  Detalles
                </Button>
              </Box>
            </Grid>
          </Grid>

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
              <Stack spacing={2}>
                <Typography>Balance de uso: </Typography>
                <Typography variant="h3">35,200</Typography>
              </Stack>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#84B898',
                borderTopRightRadius: '1.4rem',
                borderBottomRightRadius: '1.4rem',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  background: theme.palette.primary.light,
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
                  content: '""',
                  position: 'absolute',
                  zIndex: 1,
                  width: 210,
                  height: 210,
                  background: theme.palette.primary.dark,
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
                  sx={{ backgroundColor: '#fff' }}
                  endIcon={<ArrowRight />}
                >
                  Detalles
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </MainCard>
  )
}

export default Home
