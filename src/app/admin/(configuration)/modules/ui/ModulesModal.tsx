import { useState } from "react";
import { DialogContent, Grid, Box, DialogActions, Button } from "@mui/material";
import {
  FormInputDropdown,
  FormInputAutocomplete,
  FormInputText,
} from "@/components/forms";
import { CUModuleType, ModulesModalType, SaveModulesType } from "../types";
import { optionType } from "@/components/forms/FormInputDropdown";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { useForm } from "react-hook-form";
import { CONSTANTS } from "../../../../../../config";
import { MessagesInterpreter } from "@/utils";
import { Icono } from "@/components/Icono";
import { LinealLoader } from "@/components/loaders";

export const ModulesModalView = ({
  module,
  correctAction,
  cancelAction,
  modules,
}: ModulesModalType) => {
  const { sessionRequest } = useSession();
  const { control, watch, handleSubmit } = useForm<CUModuleType>({
    defaultValues: {
      id: module?.id,
      label: module?.label,
      url: module?.url,
      name: module?.name,
      properties: {
        sort: module?.properties?.sort,
        description: module?.properties?.description,
        icon: module?.properties?.icon
          ? {
              value: module?.properties?.icon,
              label: module?.properties?.icon,
              key: module?.properties?.icon,
            }
          : undefined,
      },
      state: module?.state,
      idModule: module?.module?.id,
      isSection: module?.isSection,
    },
  });
  const checked = watch("isSection");
  const icon = watch("properties.icon");

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<optionType>>([]);

  const requestSaveUpdateModule = async (module: SaveModulesType) => {
    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules${module.id ? `/${module.id}` : ""}`,
        type: !!module.id ? "patch" : "post",
        body: {
          ...module,
          properties: {
            ...module.properties,
            ...{ orden: Number(module.properties.sort) },
          },
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

  const saveUpdateModule = async (data: CUModuleType) => {
    await requestSaveUpdateModule({
      idModule: data.idModule,
      label: data.label,
      url: data.url,
      state: data.state,
      name: data.name,
      id: data.id,
      properties: {
        icon: data.properties.icon?.value,
        sort: data.properties.sort,
        description: data.properties.description,
      },
    });
  };

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
                    label: lm.label,
                  }))}
                  rules={{ required: "Este campo es requerido" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputAutocomplete
                  id={"icon"}
                  control={control}
                  name="properties.icon"
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
                    startAdornment: icon?.value && (
                      <Icono sx={{ ml: 1 }} color={"inherit"}>
                        {icon?.value}
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
                name="name"
                label="Nombre"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"label"}
                control={control}
                name="label"
                label="Label"
                disabled={loadingModal}
                rules={{ required: "Este campo es requerido" }}
              />
            </Grid>
          </Grid>
          <Box height={"15px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Grid item xs={12} sm={12} md={6}>
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
            <Grid item xs={12} sm={12} md={6}>
              <FormInputText
                id={"sort"}
                control={control}
                type={"number"}
                inputProps={{ type: "number" }}
                name="properties.sort"
                label="Orden"
                disabled={loadingModal}
                rules={{
                  required: "Este campo es requerido",
                }}
              />
            </Grid>
          </Grid>
          <Box height={"15px"} />
          <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
            <Box height={"20px"} />
            <Grid item xs={12} sm={12} md={12}>
              <FormInputText
                id={"descripcion"}
                control={control}
                name="properties.description"
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
