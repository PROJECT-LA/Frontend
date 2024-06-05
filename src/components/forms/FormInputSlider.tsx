"use client";
import React, { useEffect } from "react";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { Box, InputLabel, Slider, Typography, styled } from "@mui/material";
import { RegisterOptions, UseFormSetValue } from "react-hook-form";

type FormInputSliderProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  control: Control<T, object>;
  label: string;
  setValue: UseFormSetValue<T>;
  size?: "small" | "medium";
  rules?: RegisterOptions;
  steps?: number;
  min?: number;
  max?: number;
  initialValue?: number;
};

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    color: "#fff",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export const FormInputSlider = <T extends FieldValues>({
  id,
  name,
  control,
  setValue,
  label,
  size = "small",
  rules,
  steps,
  min,
  max,
  initialValue = 0,
}: FormInputSliderProps<T>) => {
  const [sliderValue, setSliderValue] = React.useState(initialValue);

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
              <PrettoSlider
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
