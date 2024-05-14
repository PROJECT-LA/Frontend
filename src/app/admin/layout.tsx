'use client'
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import { Constantes } from '@/config'
import Header from '@/layout/Header'
import Sidebar from '@/layout/Sidebar'
import { useGlobalStore } from '@/store'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { useEffect, useState } from 'react'

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
    marginTop: 120,
    marginLeft: open ? 40 : -(Constantes.drawerWidth - 120),
    width: '92%',
    marginRight: '2rem',
    paddingBottom: 20,
  },
  [theme.breakpoints.down('md')]: {
    width: `100%`,
    padding: '16px',
  },
}))

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
          boxShadow: scrolled ? Constantes.boxShadow : 'none',
          bgcolor: theme.palette.background.default,
          transition: openDrawer ? theme.transitions.create('width') : 'none',
        }}
      >
        <Toolbar
          sx={{
            paddingY: scrolled ? 1 : 2,
            transition: 'all .3s ease',
            marginRight: !matchDownMd ? 1 : 0,
            marginLeft: !matchDownMd
              ? openDrawer
                ? `${Constantes.drawerWidth + 20}px`
                : `100px`
              : 0,
            borderColor: theme.palette.divider,
          }}
        >
          <Header handleLeftDrawerToggle={toggleDrawer} scrolled={scrolled} />
        </Toolbar>
      </AppBar>
      <Main theme={theme} open={openDrawer}>
        {children}
      </Main>
    </div>
  )
}

export default MainLayout
