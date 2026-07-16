import type { CategoryTotal, ChartBarItem, MonthlyComparisonItem, TopCategoryItem } from '../../../shared/types/report'
import type { MonthlySummary, TransactionItem, TransactionKind } from '../../../shared/types/transaction'
import { CATEGORIES_BY_KIND } from './categories'
import { getPeriodInfo } from './dates'

export function calculateCurrentBalance(baseBalanceCents: number, transactions: TransactionItem[]) {
  return transactions.reduce(
    (balance, transaction) =>
      transaction.kind === 'income'
        ? balance + transaction.amountCents
        : balance - transaction.amountCents,
    baseBalanceCents,
  )
}

export function groupTransactionsByMonth(transactions: TransactionItem[]) {
  return transactions.reduce<Record<string, TransactionItem[]>>((groups, transaction) => {
    groups[transaction.monthKey] = [...(groups[transaction.monthKey] ?? []), transaction]
    return groups
  }, {})
}

export function getMonthlyTotals(transactions: TransactionItem[], kind: TransactionKind): MonthlySummary[] {
  const totals = transactions
    .filter((transaction) => transaction.kind === kind)
    .reduce<Record<string, number>>((result, transaction) => {
      result[transaction.monthKey] = (result[transaction.monthKey] ?? 0) + transaction.amountCents
      return result
    }, {})

  return Object.entries(totals)
    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
    .map(([monthKey, amountCents]) => ({
      monthKey,
      label: getPeriodInfo(monthKey).month,
      amountCents,
    }))
}

export function getCategoryTotals(
  transactions: TransactionItem[],
  kind: TransactionKind,
  monthKey: string,
): CategoryTotal[] {
  const totals = transactions
    .filter((transaction) => transaction.kind === kind && transaction.monthKey === monthKey)
    .reduce<Record<string, number>>((result, transaction) => {
      result[transaction.categoryId] = (result[transaction.categoryId] ?? 0) + transaction.amountCents
      return result
    }, {})

  return CATEGORIES_BY_KIND[kind].map((category) => ({
    id: category.id,
    label: category.name.toUpperCase(),
    amountCents: totals[category.id] ?? 0,
    kind,
    icon: category.icon as CategoryTotal['icon'],
  }))
}

export function getDescriptionBreakdown(
  transactions: TransactionItem[],
  kind: TransactionKind,
  monthKey: string,
  categoryId: string,
): ChartBarItem[] {
  const totals = transactions
    .filter(
      (transaction) =>
        transaction.kind === kind &&
        transaction.monthKey === monthKey &&
        transaction.categoryId === categoryId,
    )
    .reduce<Record<string, number>>((result, transaction) => {
      const label = transaction.description.trim()
      result[label] = (result[label] ?? 0) + transaction.amountCents
      return result
    }, {})

  const sorted = Object.entries(totals)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 10)
  const maximum = sorted[0]?.[1] ?? 0

  return sorted.map(([label, amountCents], index) => ({
    id: `${categoryId}-${label}`,
    label,
    amountCents,
    valuePercent: maximum > 0 ? (amountCents / maximum) * 100 : 0,
    highlight: index % 3 === 0,
  }))
}

export function getMonthlyKindTotals(transactions: TransactionItem[], monthKey: string) {
  return transactions
    .filter((transaction) => transaction.monthKey === monthKey)
    .reduce<Record<TransactionKind, number>>(
      (totals, transaction) => ({
        ...totals,
        [transaction.kind]: totals[transaction.kind] + transaction.amountCents,
      }),
      { expense: 0, income: 0 },
    )
}

export function getMonthlyComparisonItems(transactions: TransactionItem[], monthKey: string): MonthlyComparisonItem[] {
  const totals = getMonthlyKindTotals(transactions, monthKey)
  const maximum = Math.max(totals.expense, totals.income)

  return [
    {
      id: 'expense',
      label: 'Витрати',
      amountCents: totals.expense,
      valuePercent: maximum > 0 ? (totals.expense / maximum) * 100 : 0,
    },
    {
      id: 'income',
      label: 'Доходи',
      amountCents: totals.income,
      valuePercent: maximum > 0 ? (totals.income / maximum) * 100 : 0,
    },
  ]
}

export function getTopCategories(
  transactions: TransactionItem[],
  kind: TransactionKind,
  monthKey: string,
  limit = 5,
): TopCategoryItem[] {
  const categories = getCategoryTotals(transactions, kind, monthKey)
    .filter((category) => category.amountCents > 0)
    .sort((categoryA, categoryB) => categoryB.amountCents - categoryA.amountCents)
    .slice(0, limit)
  const maximum = categories[0]?.amountCents ?? 0

  return categories.map((category, index) => ({
    ...category,
    rank: index + 1,
    valuePercent: maximum > 0 ? (category.amountCents / maximum) * 100 : 0,
  }))
}
