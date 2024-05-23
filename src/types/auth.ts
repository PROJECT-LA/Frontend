import { Item } from ".";

export interface RoleType {
  id: string;
  name: string;
}

export interface UserData {
  username: string;
  names: string;
  lastNames: string;
  email: string;
}

export interface LoginType {
  username: string;
  password: string;
}

export interface UserType {
  id: string;
  idRole: string;
  roleName: string;
  roles: RoleType[];
  userData: UserData;
  sidebarData: Item[];
}
