import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../../../shared/lib/firebase'
import { timestampToDate } from '../../../shared/lib/firestore'
import type { TransactionDraft, TransactionItem } from '../../../shared/types/transaction'
import { getMonthKey } from '../utils/dates'

function transactionCollection(uid: string) {
  return collection(db, 'users', uid, 'transactions')
}

function mapTransaction(id: string, data: Record<string, unknown>): TransactionItem | null {
  if (
    (data.kind !== 'expense' && data.kind !== 'income') ||
    typeof data.date !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.categoryId !== 'string' ||
    typeof data.categoryName !== 'string' ||
    typeof data.amountCents !== 'number'
  ) {
    return null
  }

  return {
    id,
    kind: data.kind,
    date: data.date,
    monthKey:
      typeof data.monthKey === 'string' ? data.monthKey : getMonthKey(data.date),
    description: data.description,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    amountCents: Math.round(data.amountCents),
    currency: 'UAH',
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  }
}

function sortTransactions(transactions: TransactionItem[]) {
  return [...transactions].sort((transactionA, transactionB) => {
    const dateComparison = transactionB.date.localeCompare(transactionA.date)
    if (dateComparison !== 0) {
      return dateComparison
    }

    return (transactionB.createdAt?.getTime() ?? 0) - (transactionA.createdAt?.getTime() ?? 0)
  })
}

export function subscribeToTransactions(
  uid: string,
  onValue: (transactions: TransactionItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    transactionCollection(uid),
    (snapshot) => {
      const transactions = snapshot.docs
        .map((document) => mapTransaction(document.id, document.data()))
        .filter((transaction): transaction is TransactionItem => transaction !== null)
      onValue(sortTransactions(transactions))
    },
    onError,
  )
}

export async function createTransaction(uid: string, draft: TransactionDraft) {
  const reference = doc(transactionCollection(uid))
  await setDoc(reference, {
    id: reference.id,
    ...draft,
    monthKey: getMonthKey(draft.date),
    currency: 'UAH',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTransaction(uid: string, transactionId: string) {
  await deleteDoc(doc(db, 'users', uid, 'transactions', transactionId))
}
