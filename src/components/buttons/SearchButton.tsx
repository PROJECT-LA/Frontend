import { Icono } from "@/components/Icono";
import { ToggleButton } from "@mui/material";
import { Search } from "lucide-react";

interface FilterButtonParams {
  id: string;
  selected: boolean;
  change: (mostrar: boolean) => void;
}

export const SearchButton = ({ id, selected, change }: FilterButtonParams) => {
  return (
    <ToggleButton
      id={id}
      value="check"
      sx={{
        "&.MuiToggleButton-root": {
          borderRadius: "4px !important",
          border: "0px solid lightgrey !important",
        },
      }}
      size={"small"}
      selected={selected}
      onChange={() => {
        change(!selected);
      }}
      aria-label="search"
    >
      <Search />
    </ToggleButton>
  );
};
