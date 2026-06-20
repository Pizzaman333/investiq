import { Timestamp } from 'firebase/firestore'

export function timestampToDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null
}
