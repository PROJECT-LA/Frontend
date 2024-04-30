// material-ui
import { useTheme } from '@mui/material/styles'
import {
  Box,
  ButtonBase,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project imports
import MenuList from './MenuList'
import { Constantes } from '@/config'
import { ArrowLeftToLine, LogOut } from 'lucide-react'
import { Logo, LogoCorto } from '../LogoSection'
import { useState } from 'react'
import { useGlobalStore } from '@/store'

const drawerWidth = Constantes.drawerWidth

interface SidebarProps {
  drawerOpen: boolean
  drawerToggle: () => void
  window?: any
}

const Sidebar = ({ drawerOpen, drawerToggle, window }: SidebarProps) => {
  const theme = useTheme()

  const [entradaMiniDrawer, setEntradaMiniDrawer] = useState<boolean>(false)

  const { toggleDrawer } = useGlobalStore()

  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

  const drawer = (
    <>
      <Box component="span" sx={{ marginX: 3, marginTop: 2, marginBottom: 4 }}>
        <Stack direction="row" justifyContent="space-between">
          <Logo />
          <ButtonBase onClick={toggleDrawer}>
            <ArrowLeftToLine />
          </ButtonBase>
        </Stack>
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: !matchUpMd ? 'calc(100vh - 140px)' : 'calc(100vh -  150px)',
            paddingLeft: '25px',
            paddingRight: '16px',
          }}
        >
          <MenuList />
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  )

  const drawerCorto = (
    <>
      <Box
        component="span"
        sx={{
          textAlign: 'center',
          marginTop: 2,
          marginBottom: 4,
        }}
      >
        <LogoCorto />
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: !matchUpMd ? 'calc(100vh - 140px)' : 'calc(100vh -  150px)',
          }}
        >
          <MenuList />
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
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? drawerWidth : 'auto',
      }}
      aria-label="mailbox folders"
    >
      {drawerOpen ? (
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
              height: '100%',
              color: theme.palette.text.primary,
              borderRight: 1,
              borderColor: theme.palette.divider,
            },
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          onMouseEnter={() => {
            setEntradaMiniDrawer(true)
            toggleDrawer()
          }}
          container={container}
          variant={matchUpMd ? 'persistent' : 'temporary'}
          anchor="left"
          open={!drawerOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: 75,
              display: 'flex',
              alignItems: 'center',
              background: theme.palette.background.paper,
              height: '100%',
              color: theme.palette.text.primary,
              borderRight: 1,
              borderColor: theme.palette.divider,
            },
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {drawerCorto}
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar
