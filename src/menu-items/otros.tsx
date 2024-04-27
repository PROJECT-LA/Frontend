import { Phone, Book, MessageCircle, User2 } from "lucide-react";

const otros = {
  id: "otros",
  title: "Otros",
  type: "group",
  children: [
    {
      id: "contacts",
      title: "Contactos",
      type: "item",
      icon: Phone,
      url: "/contactos",
    },
    {
      id: "blog",
      title: "Blog",
      type: "item",
      icon: Book,
      url: "/blog",
    },
    {
      id: "mensajes",
      title: "Contactos",
      type: "item",
      icon: MessageCircle,
      url: "/mensajes",
    },
    {
      id: "users",
      title: "Usuarios",
      type: "item",
      icon: User2,
      url: "/users",
    },
  ],
};

export default otros;
