import { useMemo, useState, type ReactNode } from 'react'
import type { FinanceState } from '../finance/types/finance'
import type { TransactionDraft, TransactionItem } from '../../shared/types/transaction'
import { getMonthKey } from '../transactions/utils/dates'
import { DemoDataContext, type DemoDataContextValue } from './demoContext'
import { DEMO_FINANCE_STATE, DEMO_TRANSACTIONS } from './demoData'

function sortTransactions(transactions: TransactionItem[]) {
  return [...transactions].sort((transactionA, transactionB) => {
    const dateComparison = transactionB.date.localeCompare(transactionA.date)
    if (dateComparison !== 0) {
      return dateComparison
    }

    return (transactionB.createdAt?.getTime() ?? 0) - (transactionA.createdAt?.getTime() ?? 0)
  })
}

function createDemoTransaction(draft: TransactionDraft): TransactionItem {
  const now = new Date()

  return {
    id: `demo-${crypto.randomUUID()}`,
    ...draft,
    monthKey: getMonthKey(draft.date),
    currency: 'UAH',
    createdAt: now,
    updatedAt: now,
  }
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [financeState, setFinanceState] = useState<FinanceState>(DEMO_FINANCE_STATE)
  const [transactions, setTransactions] = useState<TransactionItem[]>(() => sortTransactions(DEMO_TRANSACTIONS))

  const value = useMemo<DemoDataContextValue>(
    () => ({
      financeState,
      transactions,
      async setBaseBalance(baseBalanceCents) {
        setFinanceState((currentState) => ({
          ...currentState,
          baseBalanceCents,
          balanceConfirmed: true,
          updatedAt: new Date(),
        }))
        return true
      },
      async addTransaction(draft) {
        setTransactions((currentTransactions) => sortTransactions([
          createDemoTransaction(draft),
          ...currentTransactions,
        ]))
        return true
      },
      async updateTransaction(transactionId, draft) {
        setTransactions((currentTransactions) => sortTransactions(
          currentTransactions.map((transaction) =>
            transaction.id === transactionId
              ? {
                  ...transaction,
                  kind: draft.kind,
                  date: draft.date,
                  description: draft.description,
                  categoryId: draft.categoryId,
                  categoryName: draft.categoryName,
                  amountCents: draft.amountCents,
                  monthKey: getMonthKey(draft.date),
                  currency: 'UAH',
                  updatedAt: new Date(),
                }
              : transaction,
          ),
        ))
        return true
      },
      async removeTransaction(transactionId) {
        setTransactions((currentTransactions) =>
          currentTransactions.filter((transaction) => transaction.id !== transactionId),
        )
        return true
      },
      resetDemoData() {
        setFinanceState(DEMO_FINANCE_STATE)
        setTransactions(sortTransactions(DEMO_TRANSACTIONS))
      },
    }),
    [financeState, transactions],
  )

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
}
