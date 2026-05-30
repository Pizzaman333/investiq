import type { TransactionKind } from './transaction'

export interface PeriodInfo {
  month: string
  year: string
}

export interface ReportCategory {
  id: string
  label: string
  amount: string
  kind: TransactionKind
  icon: 'products' | 'alcohol' | 'fun' | 'health' | 'transport' | 'home' | 'tech' | 'utilities' | 'study' | 'other' | 'salary' | 'bonus'
}

export interface ReportBarItem {
  id: string
  label: string
  amount: string
  value: number
  highlight?: boolean
}
