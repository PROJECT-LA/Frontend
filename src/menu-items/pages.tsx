import { KeyRound } from "lucide-react";

const pages = {
  id: "pages",
  title: "Páginas",
  type: "group",
  children: [
    {
      id: "authentication",
      title: "Authenticación",
      type: "collapse",
      icon: KeyRound,
      children: [
        {
          id: "login3",
          title: "Inicio de sesión",
          type: "item",
          url: "/login",
          target: true,
        },
        {
          id: "register3",
          title: "Registrar",
          type: "item",
          url: "/login",
          target: true,
        },
      ],
    },
  ],
};

export default pages;
