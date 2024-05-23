import { optionType } from "@/components/forms/FormInputDropdown";
import {
  Home,
  PackageOpen,
  ShieldQuestion,
  SlidersHorizontal,
  User,
  UserCog,
} from "lucide-react";
import { ReactNode } from "react";

export interface IconMapper {
  name: string;
  icon: ReactNode;
}

export const icons: IconMapper[] = [
  {
    name: "home",
    icon: <Home />,
  },
  {
    name: "user",
    icon: <User />,
  },
  {
    name: "user-cog",
    icon: <UserCog />,
  },
  {
    name: "sliders-horizontal",
    icon: <SlidersHorizontal />,
  },
  {
    name: "package-open",
    icon: <PackageOpen />,
  },
  {
    name: "shield-question",
    icon: <ShieldQuestion />,
  },
];
