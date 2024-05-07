import { MenuItems } from '@/types/menuTypes'

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
      icon: 'home',
    },
    {
      id: 'migrar-consulta',
      title: 'Perfil',
      type: 'item',
      url: '/admin/profile',
      icon: 'user',
    },
  ],
}

export const configuration: MenuItems = {
  id: 'configuration',
  title: "Configuración",
  type: "group",
  children: [
    {
      id: 'users',
      title: 'Usuarios',
      type: "item",
      url: '/admin/users',
      icon: 'user-cog'
    },
    {
      id: 'parameters',
      title: 'Parámetros',
      type: "item",
      url: '/admin/parameters',
      icon: 'sliders-horizontal'
    },
    {
      id: 'modules',
      title: 'Módulos',
      type: 'item',
      url: '/admin/modules',
      icon: 'package-open'
    },
    {
      id: 'policies',
      title: 'Políticas',
      type: 'item',
      url: '/admin/policies',
      icon: 'sliders-horizontal'
    },
    {
      id: 'roles',
      title: 'Roles',
      type: 'item',
      url:'/admin/roles',
      icon: 'shield-question'
    }
  ]
}

