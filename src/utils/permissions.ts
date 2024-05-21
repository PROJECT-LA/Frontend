"use server";
import { notFound } from "next/navigation";
import { CONSTANTS } from "../../config";
import { cookies } from "next/headers";
import { checkToken } from "./token";

export interface PermissionTypes {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface GlobalPermissionsProps {
  permissions: PermissionTypes;
}

const getPermissions = (permission: string): PermissionTypes => {
  return {
    read: permission.includes("read"),
    create: permission.includes("create"),
    update: permission.includes("update"),
    delete: permission.includes("delete"),
  };
};

export const getFrontendPermissions = async (
  route: string
): Promise<PermissionTypes | void> => {
  const cookie = cookies();
  let token = cookie.get("token");
  let tokenValue: string = "";

  if (!token) cookie.delete("token");

  if (token) tokenValue = token.value;

  if (!checkToken(tokenValue)) {
    const resNewToken = await fetch(`${CONSTANTS.baseUrl}/auth/token`, {
      method: "POST",
    });

    if (resNewToken.status == 401) {
      cookie.set("token", "", { maxAge: 0 });
    }
    const newToken = await resNewToken.json();

    cookie.set("token", newToken.data.datos);
    tokenValue = newToken.data.datos;
  }

  const resPermissions = await fetch(
    `${CONSTANTS.baseUrl}/policies/authorization`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenValue}`,
      },
      body: JSON.stringify({
        route,
      }),
      next: {
        revalidate: 18000,
      },
    }
  );

  if (
    !resPermissions.ok ||
    resPermissions.status === 401 ||
    resPermissions.status === 403
  )
    notFound();

  const data = await resPermissions.json();

  const dataPermissions: PermissionTypes = getPermissions(data.data.policie);

  return dataPermissions;
};
