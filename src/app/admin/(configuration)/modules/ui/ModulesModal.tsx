import { ReactNode, useEffect, useState } from "react";
import { DialogContent, Grid, Box, DialogActions, Button } from "@mui/material";
import {
  FormInputDropdown,
  FormInputAutocomplete,
  FormInputText,
} from "@/components/forms";
import { ModuleCRUDType, CUModuleType } from "../types/modulesTypes";
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
  sections: ModuleCRUDType[];
  isSection: boolean;
}

export const ModulesModalView = ({
  module,
  correctAction,
  cancelAction,
  sections,
  isSection,
}: ModulesModalType) => {
  const { sessionRequest } = useSession();
  const { control, watch, handleSubmit } = useForm<ModuleCRUDType>({
    defaultValues: {
      id: module?.id,
      title: module?.title,
      url: module?.url,
      icon: module?.icon,
      order: module?.order,
      description: module?.description,
      module: {
        id: module?.module?.id,
        order: module?.module?.order,
        title: module?.module?.title,
      },
    },
  });

  const iconWatch = watch("icon");

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<optionType>>([]);

  const saveUpdateModule = async (module: ModuleCRUDType) => {
    print(module);

    let sendModule: CUModuleType | null = null;
    if (isSection) {
      sendModule = {
        title: module.title,
        order: Number(module.order),
        description: module.description,
      };
    } else {
      sendModule = {
        title: module.title,
        url: module.url,
        // @ts-ignore error en el tipo value
        icon: module.icon ? module.icon.value : "home",
        order: Number(module.order),
        idModule: module.module ? module.module.id : "",
        description: module.description,
      };
    }

    try {
      setLoadingModal(true);
      const res = await sessionRequest({
        url: `${CONSTANTS.baseUrl}/modules${module.id ? `/${module.id}` : ""}`,
        type: !!module.id ? "patch" : "post",
        body: sendModule,
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
        value: icon.name,
      });
    }
    setOptions(newOptions);
  };

  useEffect(() => {
    getIcons().finally(() => {});
    // eslint-disable-next-line
  }, []);

  const [actualIcon, setActualIcon] = useState<ReactNode | undefined | null>(
    getIconLucide(module?.icon ? module?.icon : "")
  );
  useEffect(() => {
    if (iconWatch) {
      // @ts-expect-error Value en iconWatch
      setActualIcon(getIconLucide(iconWatch.value));
    }
  }, [iconWatch]);

  return (
    <form onSubmit={handleSubmit(saveUpdateModule)}>
      <DialogContent dividers>
        <Grid container direction={"column"} justifyContent="space-evenly">
          {!isSection && (
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid item xs={12} sm={12} md={6}>
                <FormInputDropdown
                  id={"idModule"}
                  name="module.id"
                  control={control}
                  label="Sección"
                  disabled={loadingModal}
                  options={sections.map((lm) => ({
                    key: lm.id,
                    value: lm.id,
                    label: lm.title,
                  }))}
                  rules={
                    isSection ? {} : { required: "Este campo es requerido" }
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} alignContent="end">
                <FormInputAutocomplete
                  id={"icon"}
                  control={control}
                  name="icon"
                  label="Icono"
                  disabled={loadingModal}
                  rules={
                    isSection
                      ? {}
                      : {
                          required: "Este campo es requerido",
                        }
                  }
                  freeSolo
                  newValues
                  forcePopupIcon
                  options={options}
                  InputProps={{
                    startAdornment: iconWatch && (
                      <Icono sx={{ ml: 1 }}>{actualIcon}</Icono>
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
          {!isSection && (
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
