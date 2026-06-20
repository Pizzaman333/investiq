import trashIcon from '../../../../assets/icons/ui/trash.svg'
import type { TransactionItem, TransactionKind } from '../../../../shared/types/transaction'
import { formatDateForDisplay } from '../../utils/dates'
import { formatMoney } from '../../utils/money'
import styles from './TransactionTable.module.css'

export interface TransactionTableProps {
  kind: TransactionKind
  items: TransactionItem[]
  loading?: boolean
  error?: string
  deletingId?: string | null
  onDelete: (transaction: TransactionItem) => void
}

export function TransactionTable({ kind, items, loading = false, error, deletingId, onDelete }: TransactionTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span>ДАТА</span>
        <span>ОПИС</span>
        <span>КАТЕГОРІЯ</span>
        <span>СУМА</span>
      </div>
      <div className={styles.body}>
        {loading ? <p className={styles.empty}>Завантаження операцій...</p> : null}
        {!loading && error ? <p className={styles.empty}>{error}</p> : null}
        {!loading && !error && items.length === 0 ? <p className={styles.empty}>Операцій поки немає.</p> : null}
        {!loading && items.map((item) => (
          <div key={item.id} className={styles.row}>
            <span>{formatDateForDisplay(item.date)}</span>
            <span>{item.description}</span>
            <span>{item.categoryName}</span>
            <strong className={kind === 'expense' ? styles.expense : styles.income}>
              {formatMoney(kind === 'expense' ? -item.amountCents : item.amountCents, {
                currency: 'грн.',
                showPlus: kind === 'income',
                spacedSign: true,
              })}
            </strong>
            <button
              type="button"
              className={styles.delete}
              aria-label={`Видалити ${item.description}`}
              disabled={Boolean(deletingId)}
              onClick={() => onDelete(item)}
            >
              <img src={trashIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
