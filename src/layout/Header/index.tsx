import { useTheme } from '@mui/material/styles'
import { Box, ButtonBase, Stack, Button, Typography } from '@mui/material'

// project imports
import ProfileSection from './ProfileSection'
import NotificationSection from './NotificationSection'

// assets
import { Menu, Search } from 'lucide-react'
import { BotonCambioTema } from '@/components/botones'

const Header = ({
  handleLeftDrawerToggle,
}: {
  handleLeftDrawerToggle: () => void
}) => {
  const theme = useTheme()

  return (
    <>
      {/* logo & toggler button */}

      <Stack spacing={1} marginTop={2}>
        <Typography variant="h3">Bienvenido</Typography>
        <Typography variant="h1">Dashboard</Typography>
      </Stack>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <Stack gap={1} direction="row" alignItems="center">
        <Button
          endIcon={<Search />}
          sx={{ paddingY: 1, color: theme.palette.text.primary }}
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
