import type { User } from 'firebase/auth'
import {
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../../../shared/lib/firebase'
import { timestampToDate } from '../../../shared/lib/firestore'
import type { UserProfile } from '../../../shared/types/auth'
import { DEFAULT_FINANCE_STATE, type FinanceState } from '../types/finance'

export function getUserProfileRef(uid: string) {
  return doc(db, 'users', uid)
}

export function getFinanceStateRef(uid: string) {
  return doc(db, 'users', uid, 'finance', 'state')
}

export async function bootstrapUserData(user: User, displayNameOverride?: string) {
  const profileRef = getUserProfileRef(user.uid)
  const financeRef = getFinanceStateRef(user.uid)
  const [profileSnapshot, financeSnapshot] = await Promise.all([
    getDoc(profileRef),
    getDoc(financeRef),
  ])
  const legacyData = profileSnapshot.data()
  const legacyDisplayName =
    typeof legacyData?.username === 'string' ? legacyData.username.trim() : ''
  const displayName =
    displayNameOverride?.trim() ||
    user.displayName?.trim() ||
    legacyDisplayName ||
    null

  if (!financeSnapshot.exists()) {
    const legacyBalance =
      typeof legacyData?.balance === 'number' && Number.isFinite(legacyData.balance)
        ? legacyData.balance
        : 0

    await setDoc(financeRef, {
      currency: 'UAH',
      baseBalanceCents: Math.round(legacyBalance * 100),
      balanceConfirmed: legacyBalance !== 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  await setDoc(
    profileRef,
    {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: user.photoURL,
      createdAt: legacyData?.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
      username: deleteField(),
      balance: deleteField(),
    },
    { merge: true },
  )
}

export function mapUserProfile(
  uid: string,
  data: Record<string, unknown> | undefined,
  user: User,
): UserProfile {
  return {
    uid,
    email: typeof data?.email === 'string' ? data.email : user.email,
    displayName:
      typeof data?.displayName === 'string'
        ? data.displayName
        : user.displayName,
    photoURL:
      typeof data?.photoURL === 'string' ? data.photoURL : user.photoURL,
    createdAt: timestampToDate(data?.createdAt),
    updatedAt: timestampToDate(data?.updatedAt),
  }
}

export function mapFinanceState(data: Record<string, unknown> | undefined): FinanceState {
  return {
    currency: 'UAH',
    baseBalanceCents:
      typeof data?.baseBalanceCents === 'number'
        ? Math.round(data.baseBalanceCents)
        : DEFAULT_FINANCE_STATE.baseBalanceCents,
    balanceConfirmed:
      typeof data?.balanceConfirmed === 'boolean'
        ? data.balanceConfirmed
        : DEFAULT_FINANCE_STATE.balanceConfirmed,
    createdAt: timestampToDate(data?.createdAt),
    updatedAt: timestampToDate(data?.updatedAt),
  }
}

export function subscribeToUserProfile(
  user: User,
  onValue: (profile: UserProfile) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getUserProfileRef(user.uid),
    (snapshot) => onValue(mapUserProfile(user.uid, snapshot.data(), user)),
    onError,
  )
}

export function subscribeToFinanceState(
  uid: string,
  onValue: (state: FinanceState) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getFinanceStateRef(uid),
    (snapshot) => onValue(snapshot.exists() ? mapFinanceState(snapshot.data()) : DEFAULT_FINANCE_STATE),
    onError,
  )
}

export async function updateBaseBalance(uid: string, baseBalanceCents: number) {
  await setDoc(
    getFinanceStateRef(uid),
    {
      currency: 'UAH',
      baseBalanceCents,
      balanceConfirmed: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
