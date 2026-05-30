export type TransactionKind = 'expense' | 'income'

export interface TransactionItem {
  id: string
  date: string
  description: string
  category: string
  amount: string
  kind: TransactionKind
}

export interface SummaryItem {
  id: string
  label: string
  amount: string
}
