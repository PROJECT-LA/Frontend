'use client'
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import { Constantes } from '@/config'
import { usePathname } from 'next/navigation'
import Header from '@/layout/Header'
import Sidebar from '@/layout/Sidebar'
import { useGlobalStore } from '@/store'
import 'react-perfect-scrollbar/dist/css/styles.css'

interface MainProps {
  open: boolean
  theme?: any
}

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme',
})<MainProps>(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  position: 'relative',
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginTop: 100,
    marginLeft: open ? 15 : -(Constantes.drawerWidth - 120),
    width: '92%',
    marginRight: open && '1.4rem',
    paddingBottom: 20,
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${Constantes.drawerWidth}px)`,
    padding: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${Constantes.drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px',
  },
}))

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))

  const { openDrawer, toggleDrawer } = useGlobalStore()

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Sidebar
        drawerOpen={!matchDownMd ? openDrawer : !openDrawer}
        drawerToggle={toggleDrawer}
      />

      <AppBar
        enableColorOnDark
        position="fixed"
        sx={{
          boxShadow: 'none',
          bgcolor: theme.palette.background.default,
          transition: openDrawer ? theme.transitions.create('width') : 'none',
        }}
      >
        <Toolbar
          sx={{
            paddingY: 2,
            marginRight: 2.5,
            marginLeft: openDrawer
              ? `${Constantes.drawerWidth + 50}px`
              : `100px`,
            borderColor: theme.palette.divider,
          }}
        >
          <Header handleLeftDrawerToggle={toggleDrawer} />
        </Toolbar>
      </AppBar>
      <Main theme={theme} open={openDrawer}>
        {children}
      </Main>
    </div>
  )
}

export default MainLayout
