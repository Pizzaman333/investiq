export type TransactionKind = 'expense' | 'income'

export type Currency = 'UAH'

export interface TransactionCategory {
  id: string
  name: string
  kind: TransactionKind
  icon: string
}

export interface TransactionItem {
  id: string
  kind: TransactionKind
  date: string
  monthKey: string
  description: string
  categoryId: string
  categoryName: string
  amountCents: number
  currency: Currency
  createdAt: Date | null
  updatedAt: Date | null
}

export interface TransactionDraft {
  kind: TransactionKind
  date: string
  description: string
  categoryId: string
  categoryName: string
  amountCents: number
}

export interface MonthlySummary {
  monthKey: string
  label: string
  amountCents: number
}
