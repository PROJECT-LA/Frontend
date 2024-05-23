"use client";
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import { useAuthStore } from "@/store";

const MenuList = () => {
  const { user } = useAuthStore();

  const navItems = user?.sidebarData.map((item) => {
    if (item.id && item.title && item.title?.length > 0) {
      return (
        <NavGroup key={`nav-group-${item.id}-${item.title}`} item={item} />
      );
    } else {
      return (
        <Typography
          key={`error-${item.id}`}
          variant="h6"
          color="error"
          align="center"
        >
          Menu Items Error
        </Typography>
      );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
