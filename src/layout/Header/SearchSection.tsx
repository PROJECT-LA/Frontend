"use client";
import { useState, useEffect, useRef } from "react";
import {
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowBigDown, Home, Search } from "lucide-react";
import React, { ReactNode } from "react";

interface SearchData {
  icon: ReactNode;
  name: string;
  description: string;
}

const sampleData: SearchData[] = [
  {
    icon: <Search size={17} />,
    name: "John Doe",
    description: "Software Developer",
  },
  {
    icon: <Home size={17} />,
    name: "Jane Smith",
    description: "Graphic Designer",
  },
  {
    icon: <ArrowBigDown size={17} />,
    name: "Mike Johnson",
    description: "Product Manager",
  },
];

const SearchSection = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchData[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: any) => {
    const { value } = e.target;
    setQuery(value);
    if (value) {
      const filteredResults = sampleData.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "250px" }}>
      <TextField
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: theme.palette.text.primary,
          },
          "& .MuiInputBase-input": {
            height: "0.6rem",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
        }}
        fullWidth
        placeholder="Buscar..."
        variant="outlined"
        value={query}
        onChange={handleChange}
      />
      {open && (
        <Paper
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <List>
            {results.length === 0 ? (
              <Typography textAlign="center" py={1}>
                No se encontró nada
              </Typography>
            ) : (
              results.map((item, index) => (
                <ListItem key={index} button>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={item.description}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchSection;
