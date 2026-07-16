import type { TopCategoryItem } from '../../../../shared/types/report'
import type { TransactionKind } from '../../../../shared/types/transaction'
import { formatMoney } from '../../../transactions/utils/money'
import styles from './TopCategories.module.css'

export interface TopCategoriesProps {
  kind: TransactionKind
  items: TopCategoryItem[]
}

export function TopCategories({ kind, items }: TopCategoriesProps) {
  return (
    <section className={styles.card}>
      <div>
        <p className={styles.eyebrow}>Топ категорій</p>
        <h2 className={styles.title}>{kind === 'expense' ? 'Найбільші витрати' : 'Найбільші доходи'}</h2>
      </div>
      {items.length > 0 ? (
        <div className={styles.list}>
          {items.map((item) => (
            <article key={item.id} className={styles.item}>
              <span className={styles.rank}>{item.rank}</span>
              <div className={styles.meta}>
                <div className={styles.header}>
                  <span>{item.label}</span>
                  <strong>{formatMoney(item.amountCents, { currency: 'грн.' })}</strong>
                </div>
                <span className={styles.track}>
                  <span className={styles.bar} style={{ width: `${Math.max(item.valuePercent, 6)}%` }} />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Немає категорій з даними за цей період.</p>
      )}
    </section>
  )
}
