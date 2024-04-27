'use client'
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import { Constantes } from '@/config'
import { usePathname } from 'next/navigation'
import Header from '@/layout/Header'
import Sidebar from '@/layout/Sidebar'
import { useGlobalStore } from '@/store'

interface MainProps {
  open: boolean
  theme?: any
}

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme',
})<MainProps>(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
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
    marginTop: 120,
    marginLeft: open ? 40 : -(Constantes.drawerWidth - 20),
    width: '98%',
    marginRight: open && '1.4rem',
    paddingBottom: 20,
    // width: open ? `calc(97% - ${Constantes.drawerWidth}px - 5px)` : "98%",
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

const MainLayout = ({children}: {children: React.ReactNode}) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))

  const { openDrawer, toggleDrawer } = useGlobalStore()

  const pathname = usePathname()

  console.log(pathname)

  return (
    <div
      style={{
        display: 'flex',
        // backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        enableColorOnDark
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: openDrawer ? theme.transitions.create('width') : 'none',
        }}
      >
        <Toolbar
          sx={{
            marginTop: 2.5,
            paddingY: 2,
            marginX: 2.5,
            borderRadius: Constantes.borderRadius,
            border: 1,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            boxShadow: Constantes.boxShadow,
          }}
        >
          <Header handleLeftDrawerToggle={toggleDrawer} />
        </Toolbar>
      </AppBar>

      <Sidebar
        drawerOpen={!matchDownMd ? openDrawer : !openDrawer}
        drawerToggle={toggleDrawer}
      />

      <Main theme={theme} open={openDrawer}>
        {/* <Breadcrumbs
          separator={IconChevronRight}
          navigation={navigation}
          icon
          title
          rightAlign
        /> */}
        {/* <Box bgcolor="red"> */}
        {children}
      </Main>
    </div>
  )
}

export default MainLayout
