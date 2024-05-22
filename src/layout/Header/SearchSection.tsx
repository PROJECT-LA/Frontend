"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  DialogContent,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
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
import { AlertDialog, CustomDialog } from "@/components/modals";
import { CONSTANTS } from "../../../config";

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
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);

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

  const closeAlert = () => {
    setIsOpenAlert(false);
  };
  const openAlert = () => {
    setQuery("");
    setIsOpenAlert(true);
  };

  return (
    <>
      <CustomDialog
        withoutHeader={true}
        isOpen={isOpenAlert}
        handleClose={closeAlert}
      >
        <DialogContent dividers>
          <Grid container direction={"column"} justifyContent="space-evenly">
            <Box height={"5px"} />
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
            <Box height={"20px"} />
            <Box height="70vh" overflow="auto">
              <List>
                {results.length === 0 ? (
                  <Typography textAlign="center" py={1}>
                    No se encontró nada
                  </Typography>
                ) : (
                  results.map((item) => (
                    <Link
                      onClick={closeAlert}
                      style={{ textDecoration: "none" }}
                      key={`search-list-${item.id}`}
                      href={`${item.url}`}
                    >
                      <ListItem
                        sx={{
                          ":hover": {
                            backgroundColor: theme.palette.background.default,
                          },
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                          primary={
                            item.title && (
                              <HighlightText
                                text={item.title}
                                highlight={query}
                              />
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
            </Box>
          </Grid>
        </DialogContent>
      </CustomDialog>

      <Box width="150px">
        <Button
          fullWidth
          startIcon={<Search size={18} />}
          sx={{
            paddingBottom: 1,
            paddingTop: 1,
            transition: "all .3s ease",
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.background.paper
                : "transparent",
          }}
          title="Buscar..."
          variant="outlined"
          onClick={openAlert}
        >
          Buscar...
        </Button>
      </Box>
    </>
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
