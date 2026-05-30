import { Button } from '../../shared/ui/Button/Button'
import styles from './BalanceControl.module.css'

export interface BalanceControlProps {
  amount: string
  actionLabel?: string
}

export function BalanceControl({ amount, actionLabel = 'ПІДТВЕРДИТИ' }: BalanceControlProps) {
  return (
    <div className={styles.balance}>
      <span className={styles.label}>Баланс:</span>
      <span className={styles.value}>{amount}</span>
      <Button variant="ghost" className={styles.button}>
        {actionLabel}
      </Button>
    </div>
  )
}
