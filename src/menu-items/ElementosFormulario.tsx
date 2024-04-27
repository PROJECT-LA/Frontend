// assets
import { ClipboardType } from "lucide-react";

// constant

const formulario = {
  id: "dashboard",
  title: "Elementos Formulario",
  type: "group",
  children: [
    {
      id: "boton",
      title: "Botón",
      type: "item",
      url: "/admin/form/boton",
      icon: ClipboardType,
      breadcrumbs: false,
    },
    {
      id: "autocomplete",
      title: "Autocompletado",
      type: "item",
      url: "/admin/form/autocomplete",
      icon: ClipboardType,
      Breadcrumbs: false,
    },
    {
      id: "checkbox",
      title: "Checkbox",
      type: "item",
      url: "/admin/form/checkbox",
      icon: ClipboardType,
      Breadcrumbs: false,
    },
  ],
};

export default formulario;
