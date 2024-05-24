"use server";
import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import ModulesClient2 from "./client-page-2";

const ModulesPage = async () => {
  const permissions = await getFrontendPermissions("/admin/modules");

  return (
    permissions && (
      <>
        <title>{`Módulos - ${siteName()}`}</title>
        <ModulesClient2 permissions={permissions} />
      </>
    )
  );
};

export default ModulesPage;
