import dashboard from './dashboard'
import pages from './pages'
import otros from './otros'
import formulario from './ElementosFormulario'
import { Item } from '../types/utils'

const menuItems: { items: Array<Item> } = {
  items: [dashboard, pages, formulario, otros],
}

export default menuItems
