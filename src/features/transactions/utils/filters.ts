import type { TransactionItem, TransactionKind } from '../../../shared/types/transaction'

export type TransactionTypeFilter = 'all' | TransactionKind

export interface TransactionFilters {
  monthKey: string
  type: TransactionTypeFilter
  categoryId: string
  query: string
}

export const EMPTY_TRANSACTION_FILTERS: TransactionFilters = {
  monthKey: '',
  type: 'all',
  categoryId: '',
  query: '',
}

export function filterTransactions(transactions: TransactionItem[], filters: TransactionFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('uk-UA')

  return transactions.filter((transaction) => {
    const matchesMonth = !filters.monthKey || transaction.monthKey === filters.monthKey
    const matchesType = filters.type === 'all' || transaction.kind === filters.type
    const matchesCategory = !filters.categoryId || transaction.categoryId === filters.categoryId
    const matchesQuery =
      !normalizedQuery ||
      transaction.description.toLocaleLowerCase('uk-UA').includes(normalizedQuery)

    return matchesMonth && matchesType && matchesCategory && matchesQuery
  })
}

export function hasActiveTransactionFilters(filters: TransactionFilters) {
  return Boolean(filters.monthKey || filters.categoryId || filters.query.trim() || filters.type !== 'all')
}
