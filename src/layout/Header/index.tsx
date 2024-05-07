import { useTheme } from '@mui/material/styles'
import { Box, Stack, Button, Typography } from '@mui/material'

// project imports
import ProfileSection from './ProfileSection'
import NotificationSection from './NotificationSection'

// assets
import { Search } from 'lucide-react'
import { BotonCambioTema } from '@/components/botones'

const Header = ({
  handleLeftDrawerToggle,
}: {
  handleLeftDrawerToggle: () => void
}) => {
  const theme = useTheme()

  return (
    <>
      <Stack spacing={1} marginTop={2}>
        <Typography variant="h3">Bienvenido</Typography>
        <Typography variant="h1">Dashboard</Typography>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <Stack spacing={2} direction="row" alignItems="center">
        <Button
          endIcon={<Search />}
          sx={{
            paddingY: 1,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.background.paper
                : 'transparent',
          }}
          variant="outlined"
        >
          <Typography>Búsqueda rápida</Typography>
        </Button>

        <NotificationSection />
        <BotonCambioTema />
        <ProfileSection />
      </Stack>
    </>
  )
}

export default Header
