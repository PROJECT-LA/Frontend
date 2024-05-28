"use client";
import MainCard from "@/components/cards/MainCard";
import { GlobalPermissionsProps, PermissionTypes } from "@/utils/permissions";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { FC, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  Grab,
  GripVertical,
  ListCollapse,
  Pencil,
  PlusCircle,
  ToggleRight,
} from "lucide-react";
import { IconTooltip } from "@/components/buttons";
import { CONSTANTS } from "../../../../../config";
import { Item } from "@/types";
import { siteName } from "@/utils";

const Sidebar: Item[] = [
  {
    id: "1",
    status: "ACTIVO",
    title: "Principal",
    description: "Sección principal",
    subModule: [
      {
        id: "2",
        status: "ACTIVO",
        title: "Inicio",
        icon: "home",
        url: "/admin/home",
      },
      {
        id: "3",
        status: "ACTIVO",
        title: "Perfil",
        icon: "user",
        url: "/admin/profile",
      },
    ],
  },
  {
    id: "4",
    status: "ACTIVO",
    title: "Configuración",
    description: "Sección de configuraciones",
    subModule: [
      {
        id: "5",
        status: "ACTIVO",
        title: "Usuarios",
        icon: "users",
        url: "/admin/users",
      },
      {
        id: "6",
        status: "ACTIVO",
        title: "Parámetros",
        icon: "settings-2",
        url: "/admin/parameters",
      },
      {
        id: "7",
        status: "ACTIVO",
        title: "Módulos",
        icon: "package-open",
        url: "/admin/modules",
      },
      {
        id: "8",
        status: "ACTIVO",
        title: "Permisos",
        icon: "lock",
        url: "/admin/policies",
      },
      {
        id: "9",
        status: "ACTIVO",
        title: "Roles",
        icon: "notebook",
        url: "/admin/roles",
      },
    ],
  },
];

const ModulesClient2 = ({ permissions }: GlobalPermissionsProps) => {
  const theme = useTheme();

  const [modulesSection, setModulesSection] = useState<Item[]>(Sidebar);

  const [games, setGames] = useState([
    { name: "Dota 2", items: ["Item 1", "Item 2"] },
    { name: "League of Legends", items: ["Item 3", "Item 4"] },
    { name: "CS:GO", items: ["Item 5", "Item 6"] },
    { name: "World of Warcraft", items: ["Item 7", "Item 8"] },
    { name: "The Witcher", items: ["Item 9", "Item 10"] },
    { name: "God of War", items: ["Item 11", "Item 12"] },
    { name: "Diablo", items: ["Item 13", "Item 14"] },
  ]);

  const reorderGamesList = (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      setGames((games) => {
        const oldIdx = games.findIndex((game) => game.name === e.active.id);
        const newIdx = games.findIndex((game) => game.name === e.over!.id);
        return arrayMove(games, oldIdx, newIdx);
      });
    }
  };

  const reorderGameItems = (parentIndex: number, e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      setGames((games) => {
        const newGames = [...games];
        const items = newGames[parentIndex].items;
        const oldIdx = items.indexOf(e.active.id.toString());
        const newIdx = items.indexOf(e.over!.id.toString());
        newGames[parentIndex].items = arrayMove(items, oldIdx, newIdx);
        return newGames;
      });
    }
  };

  return (
    <>
      <title>{`Módulos - ${siteName()}`}</title>
      <Stack
        alignItems="center"
        direction="row"
        width="100%"
        justifyContent="space-between"
      >
        <Typography variant="h4">Módulos</Typography>
        <Button variant="contained" startIcon={<ListCollapse size={18} />}>
          <Typography>Nueva Sección</Typography>
        </Button>
      </Stack>
      <DndContext onDragEnd={reorderGamesList}>
        <Box marginTop={3} minHeight="80vh">
          <Card
            sx={{
              padding: 4,
              borderRadius: CONSTANTS.borderRadius,
              height: "100%",
            }}
          >
            <SortableContext items={games.map((game) => game.name)}>
              <Stack height="100%" spacing={CONSTANTS.gridSpacing}>
                {games.map((game, index) => (
                  <div key={`lista-juego-${index}`}>
                    <GameItem
                      name={game.name}
                      items={game.items}
                      permissions={permissions}
                      parentIndex={index}
                      reorderGameItems={reorderGameItems}
                    />
                  </div>
                ))}
              </Stack>
            </SortableContext>
          </Card>
        </Box>
      </DndContext>
    </>
  );
};

interface IGameItem {
  name: string;
  items: string[];
  permissions: PermissionTypes;
  parentIndex: number;
  reorderGameItems: (parentIndex: number, e: DragEndEvent) => void;
}

const GameItem = ({
  name,
  items,
  permissions,
  parentIndex,
  reorderGameItems,
}: IGameItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: name });

  return (
    <DndContext onDragEnd={(e) => reorderGameItems(parentIndex, e)}>
      <Box
        {...listeners}
        ref={setNodeRef}
        {...attributes}
        sx={{
          borderColor: "black",
          border: 1,
          width: "100%",
          height: "100%",
          marginBottom: 1,
          padding: 1,
          borderRadius: 2,
          transition: transition,
          transform: CSS.Transform.toString(transform),
          bgcolor: "background.paper",

          boxShadow: 3,
        }}
      >
        <Stack width="100%">
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      ":hover": {
                        cursor: "grab",
                      },
                      ":active": {
                        cursor: "grabbing",
                      },
                    }}
                  >
                    <IconButton>
                      <GripVertical />
                    </IconButton>
                  </Box>
                  <Typography>{name}</Typography>
                </Stack>
                <Divider />
              </>
            </AccordionSummary>

            <AccordionDetails>
              <SortableContext items={items}>
                <List>
                  {items.map((item, index) => (
                    <ItemSection key={`lista-item-${index}`} id={item}>
                      {item}
                    </ItemSection>
                  ))}
                </List>
              </SortableContext>
            </AccordionDetails>
          </Accordion>
          <Button fullWidth variant="outlined" startIcon={<PlusCircle />}>
            Agregar módulo
          </Button>
        </Stack>
      </Box>
    </DndContext>
  );
};

interface IItem {
  id: string;
  children: string;
}

const ItemSection = ({ id, children }: IItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        borderColor: "black",
        border: 1,
        marginBottom: 1,
        padding: 1,
        borderRadius: 2,
        transition: transition,
        transform: CSS.Transform.toString(transform),
        bgcolor: "background.paper",
        ":hover": {
          cursor: "grab",
          bgcolor: "grey.100",
        },
        ":active": {
          cursor: "grabbing",
          bgcolor: "grey.200",
        },
        boxShadow: 3,
      }}
    >
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <GripVertical />
          {children}
        </Stack>
        <Stack>
          <IconTooltip
            id={`editarModulo-${children}`}
            title={"Editar"}
            color={"primary"}
            action={() => {}}
            icon={<Pencil />}
            name={"Editar módulo"}
          />
        </Stack>
      </Stack>
    </ListItem>
  );
};

export default ModulesClient2;
