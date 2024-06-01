import { read } from "fs";

export interface PermissionTypes {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface GlobalPermissionsProps {
  permissions: PermissionTypes;
}

export const initialPermissions: PermissionTypes = {
  read: false,
  create: false,
  update: false,
  delete: false,
};

export const getPermissionsBoolean = (permisos: string): PermissionTypes => {
  return {
    read: permisos.includes("read"),
    create: permisos.includes("create"),
    update: permisos.includes("update"),
    delete: permisos.includes("delete"),
  };
};
