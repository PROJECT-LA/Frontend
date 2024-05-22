"use server";
import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import ModulesClient from "./client-page";

const ModulesPage = async () => {
  const permissions = await getFrontendPermissions("/admin/policies");

  return (
    permissions && (
      <>
        <title>{`Módulos - ${siteName()}`}</title>
        <ModulesClient permissions={permissions} />
      </>
    )
  );
};

export default ModulesPage;
