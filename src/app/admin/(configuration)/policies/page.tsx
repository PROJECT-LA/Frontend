"use server";
import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import ParametersClient from "./client-page";

const PoliciesPage = async () => {
  const permissions = await getFrontendPermissions("/admin/policies");

  return (
    permissions && (
      <>
        <title>{`Políticas - ${siteName()}`}</title>
        <ParametersClient permissions={permissions} />
      </>
    )
  );
};

export default PoliciesPage;
