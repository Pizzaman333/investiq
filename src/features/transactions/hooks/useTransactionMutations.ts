import { useState } from 'react'
import type { TransactionDraft } from '../../../shared/types/transaction'
import { getFirebaseErrorMessage } from '../../auth/utils/firebaseErrors'
import { createTransaction, deleteTransaction } from '../services/transactionService'

export function useTransactionMutations(uid: string | undefined) {
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function addTransaction(draft: TransactionDraft) {
    if (!uid || saving) {
      return false
    }

    setSaving(true)
    setError('')
    try {
      await createTransaction(uid, draft)
      return true
    } catch (mutationError) {
      setError(getFirebaseErrorMessage(mutationError))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function removeTransaction(transactionId: string) {
    if (!uid || deletingId) {
      return false
    }

    setDeletingId(transactionId)
    setError('')
    try {
      await deleteTransaction(uid, transactionId)
      return true
    } catch (mutationError) {
      setError(getFirebaseErrorMessage(mutationError))
      return false
    } finally {
      setDeletingId(null)
    }
  }

  return { addTransaction, removeTransaction, saving, deletingId, error }
}
