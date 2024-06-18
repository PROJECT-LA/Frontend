import React, { useState } from "react";
import { CUAudit } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";

interface AuditModalView {
  audit?: CUAudit | undefined;
  correctAction: () => void;
  cancelAction: () => void;
}

const AuditModalView = ({
  audit,
  correctAction,
  cancelAction,
}: AuditModalView) => {
  const [loadingModa, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();
  const { control, handleSubmit } = useForm<CUAudit>({
    defaultValues: {
      id: audit?.id,
      acceptanceLevel: audit?.acceptanceLevel,
      beginDate: audit?.beginDate,
      description: audit?.description,
      finalDate: audit?.finalDate,
      idClient: audit?.idClient,
      idLevel: audit?.idLevel,
      idTemplate: audit?.idTemplate,
      objective: audit?.objective,
      status: audit?.status,
    },
  });

  const saveUpdateAudit = async (audit: CUAudit) => {
    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: ``,
        type: !!audit.id ? "patch" : "post",
        body: sendModule,
      });
    } catch (error) {
    } finally {
      setLoadingModal(false);
    }
  };

  return <div>ModalAudit</div>;
};

export default AuditModalView;
