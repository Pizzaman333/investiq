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
  emptyMessage = 'No transactions yet.',
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <span>DATE</span>
        <span>DESCRIPTION</span>
        <span>CATEGORY</span>
        <span>AMOUNT</span>
        <span aria-label="Actions" />
      </div>
      <div className={styles.body}>
        {loading ? <p className={styles.empty}>Loading transactions...</p> : null}
        {!loading && error ? <p className={styles.empty}>{error}</p> : null}
        {!loading && !error && items.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
        {!loading && items.map((item) => (
          <div key={item.id} className={styles.row}>
            <span>{formatDateForDisplay(item.date)}</span>
            <span>{item.description}</span>
            <span>{item.categoryName}</span>
            <strong className={item.kind === 'expense' ? styles.expense : styles.income}>
              {formatMoney(item.kind === 'expense' ? -item.amountCents : item.amountCents, {
                currency: 'UAH',
                showPlus: item.kind === 'income',
                spacedSign: true,
              })}
            </strong>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.edit}
                aria-label={`Edit ${item.description}`}
                disabled={Boolean(deletingId || updatingId)}
                onClick={() => onEdit(item)}
              >
                <EditIcon aria-hidden="true" />
              </button>
              <button
                type="button"
                className={styles.delete}
                aria-label={`Delete ${item.description}`}
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
