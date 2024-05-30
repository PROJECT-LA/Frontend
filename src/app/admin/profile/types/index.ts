import { RolCRUDType } from "../../(configuration)/users/types";

export interface UserInfo {
  names: string;
  lastNames: string;
  email: string;
  username: string;
  roles: string[];
}

export interface SendUpdatedInfo {
  email: string;
  lastNames: string;
  names: string;
  ci: string;
  phone: string;
  address: string;
}

export interface UserCUInformation {
  names: string;
  lastNames: string;
  email: string;
  phone: string;
  username: string;
  ci: string;
  address: string;
}

export interface UserProfileInfo {
  id: string;
  status: string;
  names: string;
  lastNames: string;
  email: string;
  phone: string;
  ci: string;
  address: string;
  username: string;
  roles: RolCRUDType[];
}
