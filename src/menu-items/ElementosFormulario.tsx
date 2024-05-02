import { MenuItems } from '@/types/menuTypes'

const formulario: MenuItems = {
  id: 'dashboard',
  title: 'Elementos Formulario',
  type: 'group',
  children: [
    {
      id: 'boton',
      title: 'Botón',
      type: 'item',
      url: '/admin/form/boton',
      icon: 'clipboard-type',
    },
    {
      id: 'autocomplete',
      title: 'Autocompletado',
      type: 'item',
      url: '/admin/form/autocomplete',
      icon: 'clipboard-type',
    },
    {
      id: 'checkbox',
      title: 'Checkbox',
      type: 'item',
      url: '/admin/form/checkbox',
      icon: 'clipboard-type',
    },
  ],
}

export default formulario
