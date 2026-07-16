import { createContext } from 'react'
import type { FinanceState } from '../finance/types/finance'
import type { TransactionDraft, TransactionItem } from '../../shared/types/transaction'

export interface DemoDataContextValue {
  financeState: FinanceState
  transactions: TransactionItem[]
  setBaseBalance: (baseBalanceCents: number) => Promise<boolean>
  addTransaction: (draft: TransactionDraft) => Promise<boolean>
  updateTransaction: (transactionId: string, draft: TransactionDraft) => Promise<boolean>
  removeTransaction: (transactionId: string) => Promise<boolean>
  resetDemoData: () => void
}

export const DemoDataContext = createContext<DemoDataContextValue | null>(null)
