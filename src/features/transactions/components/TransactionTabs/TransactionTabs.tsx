import type { TransactionKind } from '../../../../shared/types/transaction'
import styles from './TransactionTabs.module.css'

export interface TransactionTabsProps {
  activeKind: TransactionKind
  onChange: (kind: TransactionKind) => void
}

export function TransactionTabs({ activeKind, onChange }: TransactionTabsProps) {
  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={[styles.tab, activeKind === 'expense' ? styles.activeExpense : ''].join(' ')}
        onClick={() => onChange('expense')}
      >
        ВИТРАТИ
      </button>
      <button
        type="button"
        className={[styles.tab, activeKind === 'income' ? styles.activeIncome : ''].join(' ')}
        onClick={() => onChange('income')}
      >
        ДОХІД
      </button>
    </div>
  )
}
