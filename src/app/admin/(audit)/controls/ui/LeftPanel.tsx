import React, { useState } from "react";
import { Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { FormInputAutocomplete } from "@/components/forms";
import { useForm } from "react-hook-form";
import { optionType } from "@/components/forms/FormInputDropdown";
import { ControlGroupType } from "../types";
import { CUControlGroupType } from "../types";
import { CONSTANTS } from "../../../../../../config";
import PerfectScrollbar from "react-perfect-scrollbar";

interface SearchGroup {
  group: string;
}

interface LeftPanel {
  idTemplate: string;
  exists: boolean;
  dataControls: ControlGroupType[];
  editionControlGroup: CUControlGroupType | undefined;
  setEditionControlGroup: (data: CUControlGroupType) => void;
  loading: boolean;
}

export const LeftPanel = ({
  idTemplate,
  editionControlGroup,
  exists,
  dataControls,
  setEditionControlGroup,
  loading,
}: LeftPanel) => {
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  const optionsGroup: Array<optionType> = dataControls.map((elem) => ({
    key: `controls-group-search-${elem.id}`,
    label: `${elem.groupCode} - ${elem.group}`,
    value: elem.id,
  }));
  const { control } = useForm<SearchGroup>({
    defaultValues: {
      group: "",
    },
  });

  return (
    <>
      <Panel defaultSize={25} minSize={20} maxSize={70}>
        <Box
          position="relative"
          sx={{
            height: "100%",
            position: "relative",
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack padding={1}>
            {loading ? (
              <Skeleton height="3rem" />
            ) : (
              <FormInputAutocomplete
                control={control}
                disabled={!exists}
                InputProps={{
                  placeholder: "Busca un grupo...",
                }}
                id="group"
                name="group"
                searchIcon={true}
                onChange={(e: any) => {
                  if (e && e.value !== null) {
                    const controlGroupTemp = dataControls.find(
                      (elem) => elem.id === e.value
                    );
                    if (controlGroupTemp) {
                      setEditionControlGroup({
                        idTemplate,
                        group: controlGroupTemp.group,
                        groupCode: controlGroupTemp.groupCode,
                        groupDescription: controlGroupTemp.groupDescription,
                        id: controlGroupTemp.id,
                        objective: controlGroupTemp.objective,
                        objectiveCode: controlGroupTemp.objectiveCode,
                        objectiveDescription:
                          controlGroupTemp.objectiveDescription,
                        controls: controlGroupTemp.controls,
                        status: controlGroupTemp.status,
                      });
                    }
                  }
                }}
                options={optionsGroup}
                label=""
                freeSolo
                newValues
                forcePopupIcon
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <>{option.label}</>}
              />
            )}
          </Stack>

          {loading ? (
            <List sx={{ width: "100%" }}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ListItem key={`left-panel-item-skeleton-${index}`}>
                    <Skeleton width="100%" height="3rem" />
                  </ListItem>
                ))}
            </List>
          ) : (
            <PerfectScrollbar
              component="div"
              style={{
                height: xlUp ? "calc(75vh*0.92)" : "calc(75vh * 0.88)",
              }}
            >
              <List>
                {idTemplate !== undefined &&
                  dataControls.map((elem) => (
                    <ListItem
                      key={`group-controls-${elem.id}-${elem.groupCode}`}
                      onClick={() => {
                        setEditionControlGroup({
                          idTemplate,
                          group: elem.group,
                          groupCode: elem.groupCode,
                          groupDescription: elem.groupDescription,
                          id: elem.id,
                          objective: elem.objective,
                          objectiveCode: elem.objectiveCode,
                          objectiveDescription: elem.objectiveDescription,
                          controls: elem.controls,
                          status: elem.status,
                        });
                      }}
                    >
                      <Box
                        width={"100%"}
                        border={1}
                        borderColor={`${
                          elem.id === editionControlGroup?.id
                            ? theme.palette.primary.main
                            : theme.palette.divider + "80"
                        }`}
                        paddingX={3}
                        paddingY={2}
                        boxShadow={
                          elem.id === editionControlGroup?.id
                            ? CONSTANTS.boxShadow
                            : ""
                        }
                        borderRadius={1}
                        sx={{
                          backgroundColor: `${
                            elem.id === editionControlGroup?.id
                              ? theme.palette.primary.light + "50"
                              : "transparent !important"
                          }`,
                          cursor: "pointer",
                          transition: "all .3s ease-in",
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.light}35`,
                          },
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack spacing={0.3}>
                            <Typography variant="h5">
                              {elem.groupCode}
                            </Typography>
                            <Typography variant="subtitle2">
                              {elem.group}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            </PerfectScrollbar>
          )}
        </Box>
      </Panel>
      <PanelResizeHandle />
    </>
  );
};
