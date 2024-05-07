import dynamicIconImports from "lucide-react/dynamicIconImports"

export interface CustomCardProps {
    name: string
    value: string
    color: 'green' | 'orange' | 'purple'
    detallesUrl: string
}

export interface MinusCardProps {
    name: string
    value: string
    icon: keyof typeof dynamicIconImports
    color: string
}

export const MinusArray: MinusCardProps[] = [
    {
      color: '#97F5F5',
      icon: 'trending-up',
      name: 'Total ganancias',
      value: 'Bs. 2,000.30',
    },
    {
      color: '#E4CCFF',
      icon: 'trending-down',
      name: 'Total gastos',
      value: 'Bs. 4,600.30',
    },
    {
      color: '#FBDDC3',
      icon: 'wallet-cards',
      name: 'Gasto objetivo',
      value: 'Bs. 2,000.30',
    },
  ]