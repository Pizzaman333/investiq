import { describe, expect, it } from 'vitest'
import type { TransactionItem } from '../../../shared/types/transaction'
import {
  calculateCurrentBalance,
  getCategoryTotals,
  getDescriptionBreakdown,
  getMonthlyTotals,
} from './aggregations'

const transactions: TransactionItem[] = [
  {
    id: 'expense-1',
    kind: 'expense',
    date: '2026-06-10',
    monthKey: '2026-06',
    description: 'Метро',
    categoryId: 'transport',
    categoryName: 'Транспорт',
    amountCents: 3000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'expense-2',
    kind: 'expense',
    date: '2026-06-11',
    monthKey: '2026-06',
    description: 'Метро',
    categoryId: 'transport',
    categoryName: 'Транспорт',
    amountCents: 5000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: 'income-1',
    kind: 'income',
    date: '2026-06-01',
    monthKey: '2026-06',
    description: 'Зарплата',
    categoryId: 'salary',
    categoryName: 'ЗП',
    amountCents: 2000000,
    currency: 'UAH',
    createdAt: null,
    updatedAt: null,
  },
]

describe('finance aggregations', () => {
  it('calculates current balance without blocking negatives', () => {
    expect(calculateCurrentBalance(1000, transactions)).toBe(1993000)
    expect(calculateCurrentBalance(0, transactions.slice(0, 2))).toBe(-8000)
  })

  it('builds monthly totals', () => {
    expect(getMonthlyTotals(transactions, 'expense')[0]).toMatchObject({
      monthKey: '2026-06',
      amountCents: 8000,
    })
  })

  it('keeps zero-data categories and groups descriptions', () => {
    const categoryTotals = getCategoryTotals(transactions, 'expense', '2026-06')
    expect(categoryTotals.find((category) => category.id === 'transport')?.amountCents).toBe(8000)
    expect(categoryTotals.find((category) => category.id === 'products')?.amountCents).toBe(0)

    expect(getDescriptionBreakdown(transactions, 'expense', '2026-06', 'transport')[0]).toMatchObject({
      label: 'Метро',
      amountCents: 8000,
      valuePercent: 100,
    })
  })
})
