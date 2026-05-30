import trashIcon from '../../../../assets/icons/ui/trash.svg'
import type { TransactionItem, TransactionKind } from '../../../../shared/types/transaction'
import styles from './TransactionTable.module.css'

export interface TransactionTableProps {
  kind: TransactionKind
  items: TransactionItem[]
}

export function TransactionTable({ kind, items }: TransactionTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span>ДАТА</span>
        <span>ОПИС</span>
        <span>КАТЕГОРІЯ</span>
        <span>СУМА</span>
      </div>
      <div className={styles.body}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <span>{item.date}</span>
            <span>{item.description}</span>
            <span>{item.category}</span>
            <strong className={kind === 'expense' ? styles.expense : styles.income}>{item.amount}</strong>
            <button type="button" className={styles.delete} aria-label={`Видалити ${item.description}`}>
              <img src={trashIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        ))}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`placeholder-${index}`} className={[styles.row, styles.placeholder].join(' ')}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  )
}
