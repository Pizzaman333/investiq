import type { Currency } from '../../../shared/types/transaction'

export interface FinanceState {
  currency: Currency
  baseBalanceCents: number
  balanceConfirmed: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

export const DEFAULT_FINANCE_STATE: FinanceState = {
  currency: 'UAH',
  baseBalanceCents: 0,
  balanceConfirmed: false,
  createdAt: null,
  updatedAt: null,
}
