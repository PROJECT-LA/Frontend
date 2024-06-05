import { optionType } from "@/components/forms/FormInputDropdown";
import {
  Home,
  LineChart,
  Lock,
  Notebook,
  PackageOpen,
  Scale,
  Settings2,
  ShieldQuestion,
  SlidersHorizontal,
  User,
  UserCog,
  Users,
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
    name: "users",
    icon: <Users />,
  },
  {
    name: "settings-2",
    icon: <Settings2 />,
  },
  {
    name: "lock",
    icon: <Lock />,
  },
  {
    name: "notebook",
    icon: <Notebook />,
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
  {
    name: "scale",
    icon: <Scale />,
  },
  {
    name: "line-chart",
    icon: <LineChart />,
  },
];

export const getIconLucide = (name: string): ReactNode => {
  console.log(name);

  return icons.find((elem) => elem.name === name)?.icon;
};
