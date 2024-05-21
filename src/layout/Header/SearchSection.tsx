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
import {
  ArrowBigDown,
  Home,
  PackageOpen,
  Search,
  ShieldQuestion,
  SlidersHorizontal,
  User,
  UserCog,
} from "lucide-react";
import React, { ReactNode } from "react";
import { Item } from "@/types";
import Link from "next/link";

const sampleData: Item[] = [
  {
    id: "default",
    title: "Inicio",
    type: "item",
    url: "/admin/home",
    icon: <Home size={18} />,
    description: "Página principal del administrador",
  },
  {
    id: "migrar-consulta",
    title: "Perfil",
    type: "item",
    url: "/admin/profile",
    icon: <User size={18} />,
    description: "Gestiona y edita tu perfil personal",
  },
  {
    id: "users",
    title: "Usuarios",
    type: "item",
    url: "/admin/users",
    icon: <UserCog size={18} />,
    description: "Administrar cuentas y permisos de usuarios",
  },
  {
    id: "parameters",
    title: "Parámetros",
    type: "item",
    url: "/admin/parameters",
    icon: <SlidersHorizontal size={18} />,
    description: "Configura los parámetros del sistema",
  },
  {
    id: "modules",
    title: "Módulos",
    type: "item",
    url: "/admin/modules",
    icon: <PackageOpen size={18} />,
    description: "Gestiona los módulos del sistema",
  },
  {
    id: "policies",
    title: "Políticas",
    type: "item",
    url: "/admin/policies",
    icon: <SlidersHorizontal size={18} />,
    description: "Configura las políticas de uso y seguridad",
  },
  {
    id: "roles",
    title: "Roles",
    type: "item",
    url: "/admin/roles",
    icon: <ShieldQuestion size={18} />,
    description: "Define y administra los roles de usuario",
  },
  {
    id: "login3",
    title: "Inicio de sesión",
    type: "item",
    url: "/login",
    target: true,
    description: "Accede al sistema con tu cuenta",
  },
  {
    id: "register3",
    title: "Registrar",
    type: "item",
    url: "/login",
    target: true,
    description: "Crea una nueva cuenta de usuario",
  },
];

const SearchSection = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: any) => {
    const { value } = e.target;
    setQuery(value);
    if (value) {
      const filteredResults = sampleData.filter(
        (item) =>
          item.title?.toLowerCase().includes(value.toLowerCase()) ||
          item.description?.toLowerCase().includes(value.toLowerCase())
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
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: theme.breakpoints.down("lg") ? "150px" : "250px",
      }}
    >
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
              results.map((item) => (
                <Link
                  style={{ textDecoration: "none" }}
                  key={`search-list-${item.id}`}
                  href={`${item.url}`}
                >
                  <ListItem>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={
                        item.title && (
                          <HighlightText text={item.title} highlight={query} />
                        )
                      }
                      secondary={
                        item.description && (
                          <HighlightText
                            text={item.description}
                            highlight={query}
                          />
                        )
                      }
                      secondaryTypographyProps={{
                        style: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  </ListItem>
                </Link>
              ))
            )}
          </List>
        </Paper>
      )}
    </div>
  );
};

const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  const theme = useTheme();

  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={index}
              style={{ backgroundColor: "yellow", color: "black" }}
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
    </span>
  );
};

export default SearchSection;
