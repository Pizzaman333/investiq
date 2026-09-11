import type { TransactionCategory, TransactionKind } from '../../../shared/types/transaction'

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  { id: 'transport', name: 'Transport', kind: 'expense', icon: 'transport' },
  { id: 'products', name: 'Groceries', kind: 'expense', icon: 'products' },
  { id: 'health', name: 'Health', kind: 'expense', icon: 'health' },
  { id: 'alcohol', name: 'Alcohol', kind: 'expense', icon: 'alcohol' },
  { id: 'entertainment', name: 'Entertainment', kind: 'expense', icon: 'fun' },
  { id: 'home', name: 'Home', kind: 'expense', icon: 'home' },
  { id: 'tech', name: 'Tech', kind: 'expense', icon: 'tech' },
  { id: 'utilities', name: 'Utilities, phone', kind: 'expense', icon: 'utilities' },
  { id: 'sport-hobby', name: 'Sports, hobbies', kind: 'expense', icon: 'sport-hobby' },
  { id: 'education', name: 'Education', kind: 'expense', icon: 'study' },
  { id: 'other', name: 'Other', kind: 'expense', icon: 'other' },
]

export const INCOME_CATEGORIES: TransactionCategory[] = [
  { id: 'salary', name: 'Salary', kind: 'income', icon: 'salary' },
  { id: 'additional-income', name: 'Additional income', kind: 'income', icon: 'bonus' },
]

export const CATEGORIES_BY_KIND: Record<TransactionKind, TransactionCategory[]> = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
}

export function getCategory(kind: TransactionKind, categoryId: string) {
  return CATEGORIES_BY_KIND[kind].find((category) => category.id === categoryId)
}
