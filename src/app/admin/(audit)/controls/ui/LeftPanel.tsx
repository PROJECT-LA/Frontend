import React, { useState } from "react";
import { Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  Box,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  useTheme,
} from "@mui/material";
import { FormInputAutocomplete } from "@/components/forms";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { optionType } from "@/components/forms/FormInputDropdown";
import { ControlGroupType } from "../types";
import { CUControlGroupType } from "../types";

interface SearchGroup {
  group: string;
}

interface LeftPanel {
  idTemplate: string;
  exists: boolean;
  dataControls: ControlGroupType[];
  editionControlGroup: CUControlGroupType | undefined;
  setEditionControlGroup: (data: CUControlGroupType) => void;
}

export const LeftPanel = ({
  idTemplate,
  editionControlGroup,
  exists,
  dataControls,
  setEditionControlGroup,
}: LeftPanel) => {
  const [optionsGroup, setOptionsGroup] = useState<Array<optionType>>([]);

  const theme = useTheme();
  const { control } = useForm<SearchGroup>({
    defaultValues: {
      group: "",
    },
  });

  return (
    <>
      <Panel defaultSize={33.33} minSize={20} maxSize={80}>
        <Box
          sx={{
            height: "100%",
            overflow: "hidden",
            position: "relative",
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack padding={2} height="7rem">
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Grupo de controles
            </Typography>
            <Box height={10} />
            <FormInputAutocomplete
              control={control}
              disabled={!exists}
              InputProps={{
                placeholder: "Busca un grupo...",
              }}
              id="group"
              name="group"
              options={optionsGroup}
              label=""
              freeSolo
              newValues
              forcePopupIcon
              getOptionLabel={(option) => option.label}
              renderOption={(option) => <>{option.label}</>}
            />
          </Stack>
          <Divider />
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
                    paddingX={2}
                    paddingY={1}
                    borderRadius={1}
                    sx={{
                      backgroundColor: `${
                        elem.id === editionControlGroup?.id
                          ? theme.palette.primary.light + "15"
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
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h5">{elem.groupCode}</Typography>
                        <ChevronRight size={12} />
                        <Typography>{elem.group}</Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </ListItem>
              ))}
          </List>
        </Box>
      </Panel>
      <PanelResizeHandle />
    </>
  );
};
