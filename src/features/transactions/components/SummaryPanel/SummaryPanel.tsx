import type { SummaryItem, TransactionKind } from '../../../../shared/types/transaction'
import styles from './SummaryPanel.module.css'

export interface SummaryPanelProps {
  kind: TransactionKind
  items: SummaryItem[]
}

export function SummaryPanel({ kind, items }: SummaryPanelProps) {
  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>ЗВЕДЕННЯ</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <span>{item.label}</span>
            <strong className={kind === 'expense' ? styles.expense : styles.income}>{item.amount}</strong>
          </div>
        ))}
      </div>
    </aside>
  )
}
