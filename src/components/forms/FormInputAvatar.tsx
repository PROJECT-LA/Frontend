import { ChangeEvent, useEffect, useState } from "react";
import { Control, Path, useController, FieldValues } from "react-hook-form";
import {
  Avatar,
  Badge,
  Box,
  Fab,
  Input,
  InputLabel,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";

import { UploadCloudIcon } from "lucide-react";

type FormInputAvatarProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  control: Control<T, object>;
  label: string;
  labelVariant?: Variant;
  sxStyles?: SxProps;
};

export const FormInputAvatar = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  labelVariant = "subtitle2",
  sxStyles = {},
}: FormInputAvatarProps<T>) => {
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const { field } = useController({ name, control });

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      field.onChange(files[0]);
      setSelectedAvatar(files[0]);
    }
  };

  useEffect(() => {
    if (field.value) {
      setSelectedAvatar(field.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      id={id}
      display={"flex"}
      flexDirection={"column"}
      gap={1}
      alignItems={"center"}
    >
      <InputLabel htmlFor={id}>
        <Typography
          variant={labelVariant}
          sx={{ color: "text.primary" }}
          mr={1}
        >
          {label}
        </Typography>
      </InputLabel>
      <label>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip title="Subir imagen">
              <Fab component={"span"} color="primary" size="small">
                <UploadCloudIcon />
              </Fab>
            </Tooltip>
          }
        >
          <Avatar
            alt="Avatar"
            src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : ""}
            sx={{ width: 170, height: 170, ...sxStyles }}
          />
          <Input
            type="file"
            name={name}
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </Badge>
      </label>
    </Box>
  );
};
