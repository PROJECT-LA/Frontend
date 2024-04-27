import { useTheme } from '@mui/material/styles'
import { Box, ButtonBase, Stack, Button, Typography } from '@mui/material'

// project imports
import LogoSection from '../LogoSection'
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
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}
        >
          <LogoSection />
        </Box>
        <ButtonBase
          onClick={handleLeftDrawerToggle}
          sx={{
            width: 30,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            color: theme.palette.primary.dark,
          }}
        >
          <Menu size="1.5rem" />
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <Stack gap={1} direction="row" alignItems="center">
        <Button
          startIcon={<Search />}
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
