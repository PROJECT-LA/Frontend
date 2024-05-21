import UsersClientPage from "./client-page";
import { getFrontendPermissions } from "@/utils/permissions";
import { siteName } from "@/utils";

const getRolesData = () => {};

const getUsersData = (limit?: number, queryUser?: string, page?: number) => {};

const UsersPage = async ({
  searchParams,
}: {
  searchParams?: {
    limit?: number;
    queryUser?: string;
    page?: number;
    order?: "ASC" | "DESC";
  };
}) => {
  console.log(searchParams?.limit);
  console.log(searchParams?.order);
  console.log(searchParams?.queryUser);
  console.log(searchParams?.page);

  const permissions = await getFrontendPermissions("/admin/users");
  return (
    permissions && (
      <>
        <title>{`Usuarios - ${siteName()}`}</title>
        <UsersClientPage permissions={permissions} />;
      </>
    )
  );
};

export default UsersPage;
