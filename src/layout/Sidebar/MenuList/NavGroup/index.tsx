// material-ui
import { useTheme } from '@mui/material/styles'
import { List, Typography } from '@mui/material'

// project imports
import NavItem from '../NavItem'
import NavCollapse from '../NavCollapse'
import { Item } from '@/types/utils'
import { useGlobalStore } from '@/store'

const NavGroup = ({ item }: { item: Item }) => {
  const { openDrawer } = useGlobalStore()
  const theme = useTheme()

  // menu list collapse & items
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        )
    }
  })

  // @ts-expect-error Error en el tipo de typography
  const MenuCaption = theme.typography.menuCaption
  // @ts-expect-error Error en el tipo de typography
  const SubMenuCaption = theme.typography.subMenuCaption

  return (
    <>
      <List
        subheader={
          item.title &&
          openDrawer && (
            <Typography
              marginTop={2}
              variant="subtitle1"
              fontWeight="bold"
              sx={{ ...MenuCaption }}
              display="block"
              color={theme.palette.text.secondary}
              gutterBottom
            >
              {item.title.toUpperCase()}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{ ...SubMenuCaption }}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
    </>
  )
}

export default NavGroup
