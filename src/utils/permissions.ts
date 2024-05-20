import { notFound } from "next/navigation";
import { CONSTANTS } from "../../config";
import { cookies } from "next/headers";

export interface PermissionTypes {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
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

  if (token) tokenValue = token.value;

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

  console.log("obtener desde backend");
  console.log(data);

  const dataPermissions: PermissionTypes = getPermissions(data.data.policie);

  return dataPermissions;
};
