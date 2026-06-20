import { useEffect, useState } from 'react'
import type { TransactionItem } from '../../../shared/types/transaction'
import { getFirebaseErrorMessage } from '../../auth/utils/firebaseErrors'
import { subscribeToTransactions } from '../services/transactionService'

export function useTransactions(uid: string | undefined) {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loadedUid, setLoadedUid] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!uid) {
      return
    }

    return subscribeToTransactions(
      uid,
      (nextTransactions) => {
        setTransactions(nextTransactions)
        setError('')
        setLoadedUid(uid)
      },
      (subscriptionError) => {
        setError(getFirebaseErrorMessage(subscriptionError))
        setLoadedUid(uid)
      },
    )
  }, [uid])

  return { transactions, loading: Boolean(uid && loadedUid !== uid), error }
}
