export interface Item {
  id: string
  title?: string
  type: string
  caption?: string
  url?: string
  children?: Array<Item>
  icon?: any
  breadcrumbs?: boolean
  external?: boolean
  target?: boolean | string
}
