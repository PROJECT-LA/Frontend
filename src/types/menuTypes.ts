import dynamicIconImports from 'lucide-react/dynamicIconImports'

export interface MenuItems {
  id: string
  title: string
  type: 'group' | 'item' | 'collapse'
  icon?: keyof typeof dynamicIconImports
  url?: string
  target?: boolean
  children?: MenuItems[]
}
