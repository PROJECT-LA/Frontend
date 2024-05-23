import { useEffect, useState } from "react";
import { DialogContent, Grid, Box, DialogActions, Button } from "@mui/material";
import {
  FormInputDropdown,
  FormInputAutocomplete,
  FormInputText,
} from "@/components/forms";
import { CUModuleType, ModuleCRUDType, NewCUModuleType } from "../types";
import { optionType } from "@/components/forms/FormInputDropdown";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { CONSTANTS } from "../../../../../../config";
import { MessagesInterpreter, print } from "@/utils";
import { Icono } from "@/components/Icono";
import { LinealLoader } from "@/components/loaders";
import { getIconLucide, icons } from "@/types/icons";

interface ModulesModalType {
  module?: ModuleCRUDType | undefined | null;
  correctAction: () => void;
  cancelAction: () => void;
  modules: ModuleCRUDType[];
}

export const ModulesModalView = ({
  module,
  correctAction,
  cancelAction,
  modules,
}: ModulesModalType) => {
  const { sessionRequest } = useSession();
  const { control, watch, handleSubmit } = useForm<NewCUModuleType>({
    defaultValues: {
      id: module?.id,
      title: module?.title,
      url: module?.url,
      icon: module?.icon,
      order: module?.order,
      description: module?.description,
      idModule: module?.idModule,
    },
  });
  const checked = watch("isSection");
  const iconWatch = watch("icon");

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<optionType>>([]);

  const saveUpdateModule = async (module: NewCUModuleType) => {
    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules${module.id ? `/${module.id}` : ""}`,
        type: !!module.id ? "patch" : "post",
        body: {
          ...module,
        },
      });
      toast.success(MessagesInterpreter(res));
      correctAction();
    } catch (e) {
      toast.error(MessagesInterpreter(e));
    } finally {
      setLoadingModal(false);
    }
  };

  const getIcons = async () => {
    const newOptions: optionType[] = [];
    for (const icon of icons) {
      newOptions.push({
        key: icon.name,
        label: icon.name,
        value: icon.icon,
      });
    }

    setOptions(newOptions);
  };

  useEffect(() => {
    getIcons().finally(() => {});

    print(options);
    // eslint-disable-next-line
  }, []);

  return (
    <form onSubmit={handleSubmit(saveUpdateModule)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          {checked ? (
            <></>
          ) : (
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputDropdown
                  id={"idModule"}
                  name="idModule"
                  control={control}
                  label="Sección"
                  disabled={loadingModal}
                  options={modules.map((lm) => ({
                    key: lm.id,
                    value: lm.id,
                    label: lm.title,
                  }))}
                  rules={{ required: "Este campo es requerido" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputAutocomplete
                  id={"icon"}
                  control={control}
                  name="icon"
                  label="Icono"
                  disabled={loadingModal || checked}
                  rules={
                    !checked ? { required: "Este campo es requerido" } : {}
                  }
                  freeSolo
                  newValues
                  forcePopupIcon
                  options={options}
                  InputProps={{
                    startAdornment: iconWatch && (
                      <Icono sx={{ ml: 1 }} color={"inherit"}>
                        {getIconLucide(iconWatch)}
                      </Icono>
                    ),
                  }}
                  getOptionLabel={(option) => option.label}
                  renderOption={(option) => <>{option.label}</>}
                />
              </Grid>
            </Grid>
          )}
          <Box height={"15px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"name"}
                control={control}
                name="title"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"sort"}
                control={control}
                type={"number"}
                inputProps={{ type: "number" }}
                name="order"
                label="Orden"
                disabled={loadingModal}
                rules={{
                  required: "Este campo es requerido",
                }}
              />
            </Grid>
          </Grid>
          <Box height={"15px"} />
          {!checked && (
            <>
              <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <FormInputText
                    id={"url"}
                    control={control}
                    name="url"
                    label="URL"
                    disabled={loadingModal}
                    rules={{
                      required: {
                        value: true,
                        message: "Este campo es requerido",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box height={"15px"} />
            </>
          )}

          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Box height={"20px"} />
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"descripcion"}
                control={control}
                name="description"
                label="Descripción"
                multiline
                rows={2}
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
                onChange={(event) => {
                  const value = event.target.value;
                  return Number(value);
                }}
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
