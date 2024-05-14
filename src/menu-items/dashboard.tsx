import { MenuItems } from '@/types/menuTypes'
import {
  Home,
  PackageOpen,
  ShieldQuestion,
  SlidersHorizontal,
  User,
  UserCog,
} from 'lucide-react'

export const dashboard: MenuItems = {
  id: 'dashboard',
  title: 'Principal',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Inicio',
      type: 'item',
      url: '/admin/home',
      icon: <Home />,
    },
    {
      id: 'migrar-consulta',
      title: 'Perfil',
      type: 'item',
      url: '/admin/profile',
      icon: <User />,
    },
  ],
}

export const configuration: MenuItems = {
  id: 'configuration',
  title: 'Configuración',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      url: '/admin/users',
      icon: <UserCog />,
    },
    {
      id: 'parameters',
      title: 'Parámetros',
      type: 'item',
      url: '/admin/parameters',
      icon: <SlidersHorizontal />,
    },
    {
      id: 'modules',
      title: 'Módulos',
      type: 'item',
      url: '/admin/modules',
      icon: <PackageOpen />,
    },
    {
      id: 'policies',
      title: 'Políticas',
      type: 'item',
      url: '/admin/policies',
      icon: <SlidersHorizontal />,
    },
    {
      id: 'roles',
      title: 'Roles',
      type: 'item',
      url: '/admin/roles',
      icon: <ShieldQuestion />,
    },
  ],
}
