import {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  useEffect,
} from 'react'
import Link from 'next/link'
import { Item } from '@/types/utils'
import { usePathname } from 'next/navigation'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from '@mui/material'

import { useGlobalStore } from '@/store'

interface ListItemProps {
  component:
    | ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>>
    | string
  href?: string
  to?: string
  target?: string
}
const NavItem = ({ item, level }: { item: Item; level: any }) => {
  const theme = useTheme()

  const { cerrarDrawer, openDrawer } = useGlobalStore()
  const pathname = usePathname()
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

  // @ts-expect-error Error en el caption
  const SubMenuCaption = theme.typography.subMenuCaption

  const Icon = item.icon
  const itemIcon = item?.icon && <Icon size="1.3rem" />

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  let listItemProps: ListItemProps = {
    /* eslint-disable */
    component: forwardRef<HTMLAnchorElement>((props, ref) => {
      console.log(item)
      return (
        <Link ref={ref} {...props} href={item.url ?? '/'} target={itemTarget} />
      )
    }),
  }
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget }
  }

  const itemHandler = (id: any) => {
    console.log(id)

    if (matchesSM) cerrarDrawer()
  }

  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id)
    if (currentIndex > -1) {
      // dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, [pathname])

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '5px 10px 5px 0',
    borderRadius: `30px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && pathname === item?.url
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    fontWeight: level > 1 && pathname === item?.url ? '600 !important' : '400',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-20px',
      height: '100%',
      zIndex: '-1',

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
      transition: 'all .3s ease-in-out',
      // color: item.children ? "" : theme.palette.primary.main,
      // backgroundColor: item.children ? "" : theme.palette.primary.light,
    },
    '&:hover': {
      backgroundColor: 'transparent !important',
      //color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      // color: theme.palette.text.primary,
      backgroundColor: 'transparent !important',
      '.MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '&:before': {
        backgroundColor: theme.palette.primary.light,
        width: 'calc(100% + 16px)',
      },
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
  }))

  return (
    <ListItemStyled
      {...listItemProps}
      selected={pathname == item?.url}
      sx={{
        '&:hover': {
          '.MuiListItemIcon-root': {
            color: theme.palette.primary.main,
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
      // selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon
        sx={{
          my: 'auto',
          minWidth: !item?.icon ? 18 : 36,
          color:
            level > 1 && pathname === item?.url
              ? `${theme.palette.primary.main}!important`
              : 'inherit',
        }}
      >
        {itemIcon}
      </ListItemIcon>

      {openDrawer && (
        <ListItemText
          primary={
            <Typography variant={'h5'} color="inherit">
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography
                variant="caption"
                sx={{ ...SubMenuCaption }}
                display="block"
                gutterBottom
              >
                {item.caption}
              </Typography>
            )
          }
        />
      )}

      {/* 
        El numeral que aparece en la parte superior
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )} */}
    </ListItemStyled>
  )
}

export default NavItem
