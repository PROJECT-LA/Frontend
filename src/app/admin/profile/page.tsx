import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import ProfileClient from "./client-page";

const ProfilePage = async () => {
  const permissions = await getFrontendPermissions("/admin/profile");
  return (
    permissions && (
      <>
        <title>{`Perfil - ${siteName()}`}</title>
        <ProfileClient permissions={permissions} />
      </>
    )
  );
};

export default ProfilePage;
