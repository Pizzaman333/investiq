import { useEffect, useState } from 'react'
import { getFirebaseErrorMessage } from '../../auth/utils/firebaseErrors'
import { subscribeToFinanceState } from '../services/financeService'
import { DEFAULT_FINANCE_STATE, type FinanceState } from '../types/finance'

export function useFinanceState(uid: string | undefined) {
  const [state, setState] = useState<FinanceState>(DEFAULT_FINANCE_STATE)
  const [loadedUid, setLoadedUid] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!uid) {
      return
    }

    return subscribeToFinanceState(
      uid,
      (nextState) => {
        setState(nextState)
        setError('')
        setLoadedUid(uid)
      },
      (subscriptionError) => {
        setError(getFirebaseErrorMessage(subscriptionError))
        setLoadedUid(uid)
      },
    )
  }, [uid])

  return { state, loading: Boolean(uid && loadedUid !== uid), error }
}
