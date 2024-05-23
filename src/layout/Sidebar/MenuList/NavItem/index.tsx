import {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  useEffect,
} from "react";
import Link from "next/link";
import { Item } from "@/types";
import { usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { useGlobalStore } from "@/store";
import { Home } from "lucide-react";

interface ListItemProps {
  component:
    | ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>>
    | string;
  href?: string;
  to?: string;
  target?: string;
}
const NavItem = ({
  item,
  level,
  isFromCollapse = false,
}: {
  item: Item;
  level: any;
  isFromCollapse?: boolean;
}) => {
  const theme = useTheme();

  const { cerrarDrawer, openDrawer } = useGlobalStore();
  const pathname = usePathname();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  // @ts-expect-error Error en el caption
  const SubMenuCaption = theme.typography.subMenuCaption;

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps: ListItemProps = {
    /* eslint-disable */
    component: forwardRef<HTMLAnchorElement>((props, ref) => {
      return (
        <Link ref={ref} {...props} href={item.url ?? "/"} target={itemTarget} />
      );
    }),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (id: any) => {
    console.log(id);

    if (matchesSM) cerrarDrawer();
  };

  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      // dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, [pathname]);

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "5px 10px 5px 0",
    borderRadius: `30px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathname === item?.url
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    fontWeight: level > 1 && pathname === item?.url ? "600 !important" : "400",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      height: "100%",
      zIndex: "-1",
      borderRadius: " 0 24px 24px 0",
      transition: "all .3s ease-in-out",
      width: "0",
    },
    "&:hover::before": {
      width: "90%",
      borderRadius: "1rem",
      transition: "all .3s ease",
      backgroundColor:
        theme.palette.mode === "light"
          ? `${theme.palette.primary.main}50`
          : `${theme.palette.primary.light}50`,
      color: theme.palette.primary.light,
    },
    "& > .MuiListItemIcon-root": {
      width: 45,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      marginRight: "8px",
      transition: "all .3s ease-in-out",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&.Mui-selected": {
      backgroundColor: "transparent !important",
      ".MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "&:before": {
        backgroundColor: theme.palette.primary.light,
        width: "calc(100% + 16px)",
      },
      "&:hover": {
        color: theme.palette.text.primary,
      },
    },
  }));

  return (
    <ListItemStyled
      {...listItemProps}
      selected={pathname === item?.url}
      sx={{
        position: "relative",
        marginLeft: !openDrawer ? "15px" : "0px",
        "&.Mui-selected": {
          color:
            level > 1
              ? `${theme.palette.text.primary} !important`
              : "primary.dark",
          "& .MuiTypography-root": {
            fontWeight: "600 !important",
          },
          "&:before": {
            width: !openDrawer ? (matchDownMd ? "90%" : "75%") : "100%",
            borderRadius: "1rem",
            transition: "all .2s ease",
            backgroundColor:
              theme.palette.mode === "light"
                ? `${theme.palette.primary.main}50`
                : `${theme.palette.primary.light}50`,
            color: theme.palette.text.primary,
          },
        },
      }}
      onClick={() => itemHandler(item.id)}
    >
      {pathname === item?.url && (
        <Box
          sx={{
            height: "90%",
            position: "absolute",
            width: "5px",
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.primary.light,
            top: "3px",
            left: openDrawer ? "-20px" : "-14px",
          }}
        />
      )}
      <ListItemIcon
        sx={{
          my: "auto",
          minWidth: !item?.icon ? 18 : 36,
        }}
      >
        {!isFromCollapse && item.icon && item.icon}
      </ListItemIcon>

      {(openDrawer || matchDownMd) && (
        <ListItemText
          primary={<Typography variant={"h6"}>{item.title}</Typography>}
          secondary={
            item.caption && (
              <Typography
                variant="h6"
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
  );
};

export default NavItem;
