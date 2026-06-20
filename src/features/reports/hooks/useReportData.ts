import { useMemo } from 'react'
import type { TransactionItem, TransactionKind } from '../../../shared/types/transaction'
import { getCategoryTotals, getDescriptionBreakdown } from '../../transactions/utils/aggregations'

export function useReportData(
  transactions: TransactionItem[],
  kind: TransactionKind,
  monthKey: string,
  selectedCategoryId: string,
) {
  return useMemo(() => {
    const monthTransactions = transactions.filter((transaction) => transaction.monthKey === monthKey)
    const expenseTotalCents = monthTransactions
      .filter((transaction) => transaction.kind === 'expense')
      .reduce((total, transaction) => total + transaction.amountCents, 0)
    const incomeTotalCents = monthTransactions
      .filter((transaction) => transaction.kind === 'income')
      .reduce((total, transaction) => total + transaction.amountCents, 0)
    const categories = getCategoryTotals(transactions, kind, monthKey)
    const chartItems = getDescriptionBreakdown(
      transactions,
      kind,
      monthKey,
      selectedCategoryId,
    )

    return { expenseTotalCents, incomeTotalCents, categories, chartItems }
  }, [kind, monthKey, selectedCategoryId, transactions])
}
