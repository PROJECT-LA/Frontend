import React, { useState } from "react";
import { CUAudit } from "../types";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import { FormInputSlider, FormInputText } from "@/components/forms";
import { toast } from "sonner";
import { MessagesInterpreter } from "@/utils";
import { CONSTANTS } from "../../../../../../config";

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
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
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
        url: `${CONSTANTS.baseUrl}/audits`,
        type: !!audit.id ? "patch" : "post",
        body: audit,
      });
      toast.success(MessagesInterpreter(res));
    } catch (error) {
      toast.error(MessagesInterpreter(error));
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(saveUpdateAudit)}>
        <Grid item xs={12} sm={12} md={12}>
          <FormInputText
            id={"objective"}
            control={control}
            name="objective"
            label="Objetivo"
            disabled={loadingModal}
            rules={{ required: "Este campo es requerido" }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormInputText
            id={"description"}
            control={control}
            name="description"
            label="Description"
            disabled={loadingModal}
            rules={{ required: "Este campo es requerido" }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}></Grid>
      </form>
    </div>
  );
};

export default AuditModalView;
