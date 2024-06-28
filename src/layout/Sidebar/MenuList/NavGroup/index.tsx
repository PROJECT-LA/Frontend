// material-ui
import { useTheme } from "@mui/material/styles";
import { List, Typography } from "@mui/material";

// project imports
import NavItem from "../NavItem";
import { Item } from "@/types";
import { useGlobalStore } from "@/store";

const NavGroup = ({ item }: { item: Item }) => {
  const { openDrawer } = useGlobalStore();
  const theme = useTheme();

  const items = item.subModule?.map((menu) => {
    if (menu.icon && menu.icon.length > 0) {
      return (
        <NavItem
          key={menu.id}
          item={menu}
          level={1}
          container={item.title ?? ""}
        />
      );
    } else {
      return (
        <Typography key={menu.id} variant="h6" color="error" align="center">
          Menu Items Error
        </Typography>
      );
    }
  });

  // @ts-expect-error Error en el tipo de typography
  const MenuCaption = theme.typography.menuCaption;
  // @ts-expect-error Error en el tipo de typography
  const SubMenuCaption = theme.typography.subMenuCaption;

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
  );
};

export default NavGroup;
