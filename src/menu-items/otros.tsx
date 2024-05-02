import { MenuItems } from '@/types/menuTypes'

const otros: MenuItems = {
  id: 'otros',
  title: 'Otros',
  type: 'group',
  children: [
    {
      id: 'contacts',
      title: 'Contactos',
      type: 'item',
      icon: 'phone',
      url: '/contactos',
    },
    {
      id: 'blog',
      title: 'Blog',
      type: 'item',
      icon: 'book',
      url: '/blog',
    },
    {
      id: 'mensajes',
      title: 'Contactos',
      type: 'item',
      icon: 'message-circle',
      url: '/mensajes',
    },
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      icon: 'user',
      url: '/users',
    },
  ],
}

export default otros
