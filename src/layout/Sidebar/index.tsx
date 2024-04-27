// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, Stack, Typography, useMediaQuery } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project imports
import MenuList from './MenuList'
import { Constantes } from '@/config'
import { LogOut } from 'lucide-react'

const drawerWidth = Constantes.drawerWidth

interface SidebarProps {
  drawerOpen: boolean
  drawerToggle: () => void
  window?: any
}

const Sidebar = ({ drawerOpen, drawerToggle, window }: SidebarProps) => {
  const theme = useTheme()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

  const drawer = (
    <>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: !matchUpMd ? 'calc(100vh - 140px)' : 'calc(100vh -  150px)',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <Box>
            <MenuList />
          </Box>
          <Box
            width="100%"
            bgcolor={theme.palette.primary.light}
            borderRadius={Constantes.borderRadius}
            marginBottom={1}
            paddingX={2}
            paddingY={2}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Cerrar sesión</Typography>
              <LogOut size="1.5rem" />
            </Stack>
          </Box>
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  )

  const container =
    window !== undefined ? () => window.document.body : undefined

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.paper,
            boxShadow: Constantes.boxShadow,
            border: 1,
            borderColor: theme.palette.divider,
            borderRadius: '1rem',
            marginLeft: '1.35rem',
            height: '86%',
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '119px',
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar
