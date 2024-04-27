import { useEffect, useState } from 'react'
// import { useSelector } from "react-redux";
import { useRouter, usePathname } from 'next/navigation'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

// project imports
import NavItem from '../NavItem'

// assets
import { ChevronDown, ChevronUp, LayoutDashboard } from 'lucide-react'

const NavCollapse = ({ menu, level }: { menu: any; level: any }) => {
  const theme = useTheme()

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleClick = () => {
    setOpen(!open)
    setSelected(!selected ? menu.id : null)
    if (menu?.id !== 'authentication') {
      router.push(menu.children[0]?.url)
    }
  }

  const pathname = usePathname()
  const checkOpenForParent = (child: any, id: any) => {
    child.forEach((item: any) => {
      if (item.url === pathname) {
        setOpen(true)
        setSelected(id)
      }
    })
  }

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false)
    setSelected(null)
    if (menu.children) {
      menu.children.forEach((item: any) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id)
        }
        if (item.url === pathname) {
          setSelected(menu.id)
          setOpen(true)
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children])

  // menu collapse & item
  const menus = menu.children?.map((item: any) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })

  // @ts-expect-error Error en Sub menu
  const SubMenuCaption = theme.typography.subMenuCaption
  const Icon = menu.icon
  const menuIcon = menu.icon ? (
    <Icon
      strokeWidth={1.5}
      size="1.3rem"
      color={theme.palette.text.primary}
      style={{ marginTop: 'auto', marginBottom: 'auto' }}
    />
  ) : (
    <LayoutDashboard fontSize={level > 0 ? 'inherit' : 'medium'} />
  )

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2px',
    color: theme.palette.text.primary,
    padding: '5px 10px 5px 0',
    borderRadius: `30px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-20px',
      height: '100%',
      zIndex: '-1',
      borderRadius: ' 0 24px 24px 0',
      transition: 'all .3s ease-in-out',
      width: '0',
    },
    '&:hover::before': {
      width: 'calc(100% + 20px)',
      backgroundColor: theme.palette.primary.light,
    },
    '& > .MuiListItemIcon-root': {
      width: 45,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      marginRight: '8px',
      transition: 'all .3s ease-in-out',
      // color: item.children ? "" : theme.palette.primary.main,
      // backgroundColor: item.children ? "" : theme.palette.primary.light,
    },
    '&:hover': {
      backgroundColor: 'transparent !important',
      //color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      //color: theme.palette.text.primary,
      backgroundColor: 'transparent !important',
      '.MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '&:before': {
        backgroundColor: theme.palette.primary.light,
        width: 'calc(100% + 16px)',
      },
      '&:hover': {
        // backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
      },
    },
  }))
  return (
    <>
      <ListItemStyled
        sx={{
          '&:hover': {
            '.MuiListItemIcon-root': {
              color: 'main',
            },
          },
          '&:hover::before': {
            backgroundColor: 'light',
          },
          '&.Mui-selected': {
            color:
              level > 1
                ? `${theme.palette.text.primary} !important`
                : 'primary.main',
            '& .MuiTypography-root': {
              fontWeight: '600 !important',
            },
            '.MuiListItemIcon-root': {
              color: 'primary.main',
            },
            '&:before': {
              backgroundColor: 'primary.light',
              color: 'primary.main',
              '.MuiListItemIcon-root': {
                color: 'primary.main',
              },
            },
          },
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
          {menuIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={selected === menu.id ? 'h5' : 'body1'}
              color="inherit"
              sx={{ my: 'auto' }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography
                variant="caption"
                sx={{ ...SubMenuCaption }}
                display="block"
                gutterBottom
              >
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <ChevronUp
            size="1rem"
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />
        ) : (
          <ChevronDown
            size="1rem"
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />
        )}
      </ListItemStyled>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1,
              background: theme.palette.primary.light,
            },
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  )
}

export default NavCollapse
