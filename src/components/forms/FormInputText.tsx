import TextField from "@mui/material/TextField";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Typography from "@mui/material/Typography";
import { RegisterOptions } from "react-hook-form";
import { InputProps as StandardInputProps } from "@mui/material/Input/Input";
import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  useTheme,
} from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { InputHTMLAttributes, useState } from "react";
import { InputBaseProps } from "@mui/material/InputBase";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { X, Eye, EyeOff } from "lucide-react";

type FormInputTextProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  control: Control<T, object>;
  label: string;
  size?: "small" | "medium";
  type?: InputHTMLAttributes<unknown>["type"];
  rules?: RegisterOptions;
  disabled?: boolean;
  onChange?: StandardInputProps["onChange"];
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: InputBaseProps["inputProps"];
  onEnter?: () => void;
  clearable?: boolean;
  variant?: "standard" | "outlined" | "filled";
  rows?: number;
  placeholder?: string;
  multiline?: boolean;
  bgcolor?: string;
  labelVariant?: Variant;
};

export const FormInputText = <T extends FieldValues>({
  id,
  name,
  control,
  label,
  size = "small",
  type,
  rules,
  disabled,
  onChange,
  placeholder,
  InputProps,
  inputProps,
  onEnter,
  clearable,
  variant,
  rows = 1,
  multiline = false,
  bgcolor,
  labelVariant = "subtitle2",
}: FormInputTextProps<T>) => {
  const theme = useTheme();
  const colorIcono = theme.palette.text.primary;

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography variant={labelVariant} sx={{ color: "text.primary" }}>
          {label}
        </Typography>
      </InputLabel>
      <Box height={5} />
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <TextField
              id={id}
              autoComplete="off"
              name={name}
              variant={variant}
              sx={{
                width: "100%",
                bgcolor: bgcolor,
              }}
              size={size}
              error={!!error}
              rows={rows}
              multiline={multiline}
              type={showPassword ? "text" : type}
              onChange={(event) => {
                if (onChange) {
                  onChange(event);
                }
                field.onChange(event);
              }}
              inputRef={field.ref}
              onKeyUp={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  if (onEnter) {
                    onEnter();
                  }
                }
              }}
              placeholder={placeholder}
              value={field.value}
              disabled={disabled}
              inputProps={inputProps}
              InputProps={{
                endAdornment:
                  field.value && clearable ? (
                    <IconButton
                      size="small"
                      color={"primary"}
                      onClick={() => {
                        field.onChange("");
                      }}
                    >
                      <X color={colorIcono} />
                    </IconButton>
                  ) : type === "password" ? (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? (
                          <Eye color={colorIcono} />
                        ) : (
                          <EyeOff color={colorIcono} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                ...InputProps,
              }}
            />
            {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
          </>
        )}
        defaultValue={"" as PathValue<T, Path<T>>}
        rules={rules}
      />
    </div>
  );
};
