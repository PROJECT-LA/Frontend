"use client";
import React, { useEffect } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Box, InputLabel, Slider, Typography } from "@mui/material";
import { RegisterOptions, UseFormSetValue } from "react-hook-form";
import { Variant } from "@mui/material/styles/createTypography";

type FormInputSliderProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  control: Control<T, object>;
  label: string;
  setValue: UseFormSetValue<T>;
  size?: "small" | "medium";
  rules?: RegisterOptions;
  labelVariant?: Variant;
  steps?: number;
  min?: number;
  max?: number;
};

export const FormInputSlider = <T extends FieldValues>({
  id,
  name,
  control,
  setValue,
  label,
  size = "small",
  rules,
  labelVariant = "subtitle2",
  steps,
  min,
  max,
}: FormInputSliderProps<T>) => {
  const [sliderValue, setSliderValue] = React.useState(0);

  useEffect(() => {
    setValue(name, sliderValue as PathValue<T, Path<T>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <div>
      <InputLabel htmlFor={id}>
        <Typography variant={"caption"} sx={{ color: "text.primary" }}>
          {label}
        </Typography>
      </InputLabel>
      <Box height={10} />
      <Controller
        name={name}
        control={control}
        render={() => {
          if (steps !== undefined && max !== undefined && min !== undefined) {
            return (
              <Slider
                aria-label={`valor actual de ${name}`}
                id={id}
                name={name}
                size={size}
                sx={{ width: "100%" }}
                value={sliderValue}
                onChange={handleChange}
                getAriaValueText={(value: number) => `${name}: ${value}`}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={steps}
                marks
              />
            );
          } else {
            return (
              <Slider
                id={id}
                name={name}
                size={size}
                sx={{ width: "100%" }}
                value={sliderValue}
                onChange={handleChange}
              />
            );
          }
        }}
        rules={rules}
      />
    </div>
  );
};
