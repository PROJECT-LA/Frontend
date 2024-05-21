import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

// project imports
import NavItem from "../NavItem";

// assets
import { ChevronDown, ChevronUp, Home, LayoutDashboard } from "lucide-react";
import { useGlobalStore } from "@/store";

const NavCollapse = ({ menu, level }: { menu: any; level: any }) => {
  const { openDrawer } = useGlobalStore();

  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
    if (menu?.id !== "authentication") {
      router.push(menu.children[0]?.url);
    }
  };

  const pathname = usePathname();
  const checkOpenForParent = (child: any, id: any) => {
    child.forEach((item: any) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (menu.children) {
      menu.children.forEach((item: any) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  // menu collapse & item
  const menus = menu.children?.map((item: any) => {
    switch (item.type) {
      case "collapse":
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case "item":
        return (
          <NavItem
            key={item.id}
            isFromCollapse={true}
            item={item}
            level={level + 1}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  // @ts-expect-error Error en Sub menu
  const SubMenuCaption = theme.typography.subMenuCaption;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    marginBottom: "2px",
    color: theme.palette.text.primary,
    padding: "5px 10px 5px 0",
    borderRadius: `30px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
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
      width: "100%",
      borderRadius: "1rem",
      transition: "all .3s ease",
      backgroundColor: `${theme.palette.primary.light}50`,
      color: theme.palette.text.primary,
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
      //color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      //color: theme.palette.text.primary,
      backgroundColor: "transparent !important",
      ".MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "&:before": {
        backgroundColor: theme.palette.primary.light,
        width: "calc(100% + 16px)",
      },
      "&:hover": {
        // backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.primary,
      },
    },
  }));
  return (
    <>
      <ListItemStyled
        sx={{
          position: "relative",
          marginLeft: !openDrawer ? "15px" : "0px",
          "&.Mui-selected": {
            color:
              level > 1
                ? `${theme.palette.text.primary} !important`
                : "primary.main",
            "& .MuiTypography-root": {
              fontWeight: "600 !important",
            },
            "&:before": {
              width: !openDrawer ? (matchDownMd ? "85%" : "75%") : "100%",
              borderRadius: "1rem",
              transition: "all .2s ease",
              backgroundColor: `${theme.palette.primary.light}50`,
              color: theme.palette.text.primary,
            },
          },
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: !menu.icon ? 18 : 36 }}>
          {menu.icon && menu.icon}
        </ListItemIcon>
        {(openDrawer || matchDownMd) && (
          <>
            <ListItemText
              primary={
                <Typography
                  variant={selected === menu.id ? "h5" : "body1"}
                  color="inherit"
                  sx={{ my: "auto" }}
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
                style={{ marginTop: "auto", marginBottom: "auto" }}
              />
            ) : (
              <ChevronDown
                size="1rem"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              />
            )}
          </>
        )}
      </ListItemStyled>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: "relative",
            "&:after": {
              content: "''",
              position: "absolute",
              left: "32px",
              top: 0,
              height: "100%",
              width: "1px",
              opacity: 1,
              background: theme.palette.divider,
            },
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

export default NavCollapse;
