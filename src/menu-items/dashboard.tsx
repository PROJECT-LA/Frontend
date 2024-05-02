import { MenuItems } from '@/types/menuTypes'

const dashboard: MenuItems = {
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

export default dashboard
