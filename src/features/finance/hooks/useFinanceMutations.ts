import { useState } from 'react'
import { getFirebaseErrorMessage } from '../../auth/utils/firebaseErrors'
import { updateBaseBalance } from '../services/financeService'

export function useFinanceMutations(uid: string | undefined) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  async function setBaseBalance(baseBalanceCents: number) {
    if (!uid || updating) {
      return false
    }

    setUpdating(true)
    setError('')
    try {
      await updateBaseBalance(uid, baseBalanceCents)
      return true
    } catch (mutationError) {
      setError(getFirebaseErrorMessage(mutationError))
      return false
    } finally {
      setUpdating(false)
    }
  }

  return { setBaseBalance, updating, error }
}
