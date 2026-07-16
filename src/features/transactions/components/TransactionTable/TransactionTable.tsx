import EditIcon from '../../../../assets/icons/ui/edit.svg?react'
import TrashIcon from '../../../../assets/icons/ui/trash.svg?react'
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
  updatingId?: string | null
  emptyMessage?: string
  onEdit: (transaction: TransactionItem) => void
  onDelete: (transaction: TransactionItem) => void
}

export function TransactionTable({
  items,
  loading = false,
  error,
  deletingId,
  updatingId,
  emptyMessage = 'Операцій поки немає.',
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span>ДАТА</span>
        <span>ОПИС</span>
        <span>КАТЕГОРІЯ</span>
        <span>СУМА</span>
        <span aria-label="Дії" />
      </div>
      <div className={styles.body}>
        {loading ? <p className={styles.empty}>Завантаження операцій...</p> : null}
        {!loading && error ? <p className={styles.empty}>{error}</p> : null}
        {!loading && !error && items.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
        {!loading && items.map((item) => (
          <div key={item.id} className={styles.row}>
            <span>{formatDateForDisplay(item.date)}</span>
            <span>{item.description}</span>
            <span>{item.categoryName}</span>
            <strong className={item.kind === 'expense' ? styles.expense : styles.income}>
              {formatMoney(item.kind === 'expense' ? -item.amountCents : item.amountCents, {
                currency: 'грн.',
                showPlus: item.kind === 'income',
                spacedSign: true,
              })}
            </strong>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.edit}
                aria-label={`Редагувати ${item.description}`}
                disabled={Boolean(deletingId || updatingId)}
                onClick={() => onEdit(item)}
              >
                <EditIcon aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.delete}
                aria-label={`Видалити ${item.description}`}
                disabled={Boolean(deletingId || updatingId)}
                onClick={() => onDelete(item)}
              >
                <TrashIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
