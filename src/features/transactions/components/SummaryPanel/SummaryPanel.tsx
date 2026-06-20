import type { MonthlySummary, TransactionKind } from '../../../../shared/types/transaction'
import { formatMoney } from '../../utils/money'
import styles from './SummaryPanel.module.css'

export interface SummaryPanelProps {
  kind: TransactionKind
  items: MonthlySummary[]
}

export function SummaryPanel({ kind, items }: SummaryPanelProps) {
  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>ЗВЕДЕННЯ</h3>
      <div className={styles.list}>
        {items.length === 0 ? <p className={styles.empty}>Немає даних</p> : null}
        {items.map((item) => (
          <div key={item.monthKey} className={styles.item}>
            <span>{item.label}</span>
            <strong className={kind === 'expense' ? styles.expense : styles.income}>
              {formatMoney(kind === 'expense' ? -item.amountCents : item.amountCents, {
                currency: null,
                showPlus: kind === 'income',
              })}
            </strong>
          </div>
        ))}
      </div>
    </aside>
  )
}
