import MainCard from '@/components/cards/MainCard'
import { Badge, Box, Button, Grid, Stack, Typography } from '@mui/material'
import { PlusIcon, UserCircle2 } from 'lucide-react'
import React from 'react'

const Profile = () => {
  return (
    <MainCard>
      <Grid container>
        <Grid item xs={5}>
          <MainCard>
            <Stack
              spacing={2}
              marginY="5rem"
              justifyContent="center"
              alignItems="center"
            >
              <UserCircle2 size="4rem" />
              <Typography>Alexander Humberto Nina Pacajes</Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={6}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography>Usuario</Typography>
              <Typography>@ADMINISTRADOR</Typography>
            </Stack>
            <Stack spacing={1}>
              <Typography>Número de documento</Typography>
              <Typography>CI 5950236</Typography>
            </Stack>
            <Stack spacing={1}>
              <Typography>Fecha de Nacimiento</Typography>
              <Typography>28/05/1967</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography>Roles</Typography>
              <Stack direction="row" spacing={1}>
                <Badge>ADMINISTRADOR</Badge>
                <Badge>TÉCNICO</Badge>
              </Stack>
            </Stack>

            <Box>
              <Button variant="contained" startIcon={<PlusIcon />}>
                Cambiar contraseña
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default Profile
