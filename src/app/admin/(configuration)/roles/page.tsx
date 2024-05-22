"use server";
import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import RolesClient from "./client-page";

const RolesPage = async () => {
  const permissions = await getFrontendPermissions("/admin/roles");

  return (
    permissions && (
      <>
        <title>{`Roles - ${siteName()}`}</title>
        <RolesClient permissions={permissions} />
      </>
    )
  );
};

export default RolesPage;
