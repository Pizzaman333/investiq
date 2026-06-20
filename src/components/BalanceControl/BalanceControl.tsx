import type { ChangeEvent } from 'react'
import { Button } from '../../shared/ui/Button/Button'
import styles from './BalanceControl.module.css'

export interface BalanceControlProps {
  amount: string
  draftValue: string
  isEditing: boolean
  isNegative?: boolean
  error?: string
  actionDisabled: boolean
  onEditStart: () => void
  onDraftChange: (value: string) => void
  onConfirm: () => void
}

export function BalanceControl({
  amount,
  draftValue,
  isEditing,
  isNegative = false,
  error,
  actionDisabled,
  onEditStart,
  onDraftChange,
  onConfirm,
}: BalanceControlProps) {
  return (
    <div className={styles.balance}>
      <span className={styles.label}>Баланс:</span>
      {isEditing ? (
        <input
          autoFocus
          className={styles.input}
          aria-label="Новий базовий баланс"
          inputMode="decimal"
          value={draftValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onDraftChange(event.target.value)}
        />
      ) : (
        <button
          type="button"
          className={[styles.value, isNegative ? styles.negative : ''].filter(Boolean).join(' ')}
          onClick={onEditStart}
          title="Змінити базовий баланс"
        >
          {amount}
        </button>
      )}
      <Button variant="ghost" className={styles.button} disabled={actionDisabled} onClick={onConfirm}>
        ПІДТВЕРДИТИ
      </Button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )
}
