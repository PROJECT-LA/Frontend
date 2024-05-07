import { MenuItems } from '@/types/menuTypes'

const pages: MenuItems = {
  id: 'pages',
  title: 'Páginas',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authenticación',
      type: 'collapse',
      icon: 'key-round',
      children: [
        {
          id: 'login3',
          title: 'Inicio de sesión',
          type: 'item',
          url: '/login',
          target: true,
        },
        {
          id: 'register3',
          title: 'Registrar',
          type: 'item',
          url: '/login',
          target: true,
        },
      ],
    },
  ],
}

export default pages
