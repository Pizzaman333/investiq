import { useMemo } from 'react'
import type { TransactionItem } from '../../../shared/types/transaction'
import { calculateCurrentBalance } from '../../transactions/utils/aggregations'

export function useCurrentBalance(baseBalanceCents: number, transactions: TransactionItem[]) {
  return useMemo(
    () => calculateCurrentBalance(baseBalanceCents, transactions),
    [baseBalanceCents, transactions],
  )
}
