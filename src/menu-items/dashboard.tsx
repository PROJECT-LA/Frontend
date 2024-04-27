// assets
import { Home, CloudDownload, ScanSearch } from "lucide-react";

// constant

const dashboard = {
  id: "dashboard",
  title: "Principal",
  type: "group",
  children: [
    {
      id: "default",
      title: "Dashboard",
      type: "item",
      url: "/admin",
      icon: Home,
      breadcrumbs: false,
    },
    {
      id: "migrar-consulta",
      title: "Migrar consulta",
      type: "item",
      url: "/admin/migrar-consulta",
      icon: CloudDownload,
      Breadcrumbs: false,
    },
    {
      id: "consulta-dinamica",
      title: "Consulta dinámica",
      type: "item",
      url: "/admin/consulta-dinamica",
      icon: ScanSearch,
      Breadcrumbs: false,
    },
  ],
};

export default dashboard;
