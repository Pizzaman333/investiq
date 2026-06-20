import type { TransactionKind } from './transaction'

export interface PeriodInfo {
  monthKey: string
  month: string
  year: string
}

export interface CategoryTotal {
  id: string
  label: string
  amountCents: number
  kind: TransactionKind
  icon: 'products' | 'alcohol' | 'fun' | 'health' | 'transport' | 'home' | 'tech' | 'utilities' | 'sport-hobby' | 'study' | 'other' | 'salary' | 'bonus'
}

export interface ChartBarItem {
  id: string
  label: string
  amountCents: number
  valuePercent: number
  highlight?: boolean
}
