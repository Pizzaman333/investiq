import { describe, expect, it } from 'vitest'
import type { TransactionItem } from '../../../shared/types/transaction'
import { EMPTY_TRANSACTION_FILTERS, filterTransactions, hasActiveTransactionFilters } from './filters'

const transactions: TransactionItem[] = [
  {
    id: '1',
    kind: 'expense',
    date: '2026-07-02',
    monthKey: '2026-07',
    description: 'Metro',
    categoryId: 'transport',
    categoryName: 'Transport',
    amountCents: 3000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '2',
    kind: 'income',
    date: '2026-07-01',
    monthKey: '2026-07',
    description: 'Salary',
    categoryId: 'salary',
    categoryName: 'Salary',
    amountCents: 2000000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '3',
    kind: 'expense',
    date: '2026-06-22',
    monthKey: '2026-06',
    description: 'Coffee',
    categoryId: 'products',
    categoryName: 'Groceries',
    amountCents: 9000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
]

describe('transaction filters', () => {
  it('filters by month, type, category, and description query', () => {
    expect(filterTransactions(transactions, {
      monthKey: '2026-07',
      type: 'expense',
      categoryId: 'transport',
      query: 'met',
    }).map((transaction) => transaction.id)).toEqual(['1'])
  })

  it('supports all transaction types and empty filters', () => {
    expect(filterTransactions(transactions, EMPTY_TRANSACTION_FILTERS)).toHaveLength(3)
    expect(filterTransactions(transactions, { ...EMPTY_TRANSACTION_FILTERS, type: 'all', query: 'sal' }))
      .toHaveLength(1)
  })

  it('detects active filters', () => {
    expect(hasActiveTransactionFilters(EMPTY_TRANSACTION_FILTERS)).toBe(false)
    expect(hasActiveTransactionFilters({ ...EMPTY_TRANSACTION_FILTERS, type: 'income' })).toBe(true)
    expect(hasActiveTransactionFilters({ ...EMPTY_TRANSACTION_FILTERS, query: '  coffee ' })).toBe(true)
  })
})
