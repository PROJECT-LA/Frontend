import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RolCRUDType } from "../types";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { delay, MessagesInterpreter, print } from "@/utils";
import { CONSTANTS } from "../../../../../../config";
import { Button, Box, DialogActions, DialogContent, Grid } from "@mui/material";
import { FormInputText } from "@/components/forms";
import { LinealLoader } from "@/components/loaders";

export interface ModalRoleType {
  role?: RolCRUDType;
  correctAction: () => void;
  cancelAction: () => void;
}

export const RoleModalView = ({
  role,
  correctAction,
  cancelAction,
}: ModalRoleType) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { sessionRequest } = useSession();
  const { handleSubmit, control } = useForm<RolCRUDType>({
    defaultValues: {
      id: role?.id,
      name: role?.name,
      description: role?.description,
    },
  });

  const saveUpdateRole = async (data: RolCRUDType) => {
    await saveUpdateRolesRequest(data);
  };

  const saveUpdateRolesRequest = async (role: RolCRUDType) => {
    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/roles${role.id ? `/${role.id}` : ""}`,
        type: !!role.id ? "patch" : "post",
        body: role,
      });
      toast.success(MessagesInterpreter(res));
      correctAction();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(saveUpdateRole)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"rol"}
                control={control}
                name="name"
                label="Rol"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"nombre"}
                control={control}
                name="description"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"20px"} />
          <LinealLoader mostrar={loadingModal} />
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          my: 1,
          mx: 2,
          justifyContent: {
            lg: "flex-end",
            md: "flex-end",
            xs: "center",
            sm: "center",
          },
        }}
      >
        <Button
          variant={"outlined"}
          disabled={loadingModal}
          onClick={cancelAction}
        >
          Cancelar
        </Button>
        <Button variant={"contained"} disabled={loadingModal} type={"submit"}>
          Guardar
        </Button>
      </DialogActions>
    </form>
  );
};
