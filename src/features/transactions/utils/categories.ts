import type { TransactionCategory, TransactionKind } from '../../../shared/types/transaction'

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  { id: 'transport', name: 'Транспорт', kind: 'expense', icon: 'transport' },
  { id: 'products', name: 'Продукти', kind: 'expense', icon: 'products' },
  { id: 'health', name: "Здоров'я", kind: 'expense', icon: 'health' },
  { id: 'alcohol', name: 'Алкоголь', kind: 'expense', icon: 'alcohol' },
  { id: 'entertainment', name: 'Розваги', kind: 'expense', icon: 'fun' },
  { id: 'home', name: 'Все для дому', kind: 'expense', icon: 'home' },
  { id: 'tech', name: 'Техніка', kind: 'expense', icon: 'tech' },
  { id: 'utilities', name: 'Комуналка, зв’язок', kind: 'expense', icon: 'utilities' },
  { id: 'sport-hobby', name: 'Спорт, хобі', kind: 'expense', icon: 'sport-hobby' },
  { id: 'education', name: 'Навчання', kind: 'expense', icon: 'study' },
  { id: 'other', name: 'Інше', kind: 'expense', icon: 'other' },
]

export const INCOME_CATEGORIES: TransactionCategory[] = [
  { id: 'salary', name: 'ЗП', kind: 'income', icon: 'salary' },
  { id: 'additional-income', name: 'Дод. прибуток', kind: 'income', icon: 'bonus' },
]

export const CATEGORIES_BY_KIND: Record<TransactionKind, TransactionCategory[]> = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
}

export function getCategory(kind: TransactionKind, categoryId: string) {
  return CATEGORIES_BY_KIND[kind].find((category) => category.id === categoryId)
}
