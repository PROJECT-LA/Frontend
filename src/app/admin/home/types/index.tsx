import { TrendingUp, TrendingDown, WalletCards } from 'lucide-react'
import { ReactNode } from 'react'

export interface CustomCardProps {
  name: string
  value: string
  color: 'green' | 'orange' | 'purple'
  detallesUrl: string
}

export interface MinusCardProps {
  name: string
  value: string
  icon?: ReactNode
  color: string
}

export const MinusArray: MinusCardProps[] = [
  {
    color: '#97F5F5',
    name: 'Total ganancias',
    value: 'Bs. 2,000.30',
    icon: <TrendingUp />,
  },
  {
    color: '#E4CCFF',
    name: 'Total gastos',
    value: 'Bs. 4,600.30',
    icon: <TrendingDown />,
  },
  {
    color: '#FBDDC3',
    name: 'Gasto objetivo',
    value: 'Bs. 2,000.30',
    icon: <WalletCards />,
  },
]
