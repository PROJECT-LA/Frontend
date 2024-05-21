"use server";
import { siteName } from "@/utils";
import { getFrontendPermissions } from "@/utils/permissions";
import React from "react";
import ParametersClient from "./client-page";

const ParametersPage = async () => {
  const permissions = await getFrontendPermissions("/admin/parameters");

  return (
    permissions && (
      <>
        <title>{`Parámetros - ${siteName()}`}</title>
        <ParametersClient permissions={permissions} />
      </>
    )
  );
};

export default ParametersPage;
