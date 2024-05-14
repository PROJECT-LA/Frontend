import { ReactNode } from 'react'

export interface MenuItems {
  id: string
  title: string
  type: 'group' | 'item' | 'collapse'
  icon?: ReactNode
  url?: string
  target?: boolean
  children?: MenuItems[]
}
