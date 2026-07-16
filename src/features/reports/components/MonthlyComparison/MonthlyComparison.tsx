import type { MonthlyComparisonItem } from '../../../../shared/types/report'
import { formatMoney } from '../../../transactions/utils/money'
import styles from './MonthlyComparison.module.css'

export interface MonthlyComparisonProps {
  items: MonthlyComparisonItem[]
}

export function MonthlyComparison({ items }: MonthlyComparisonProps) {
  const hasData = items.some((item) => item.amountCents > 0)

  return (
    <section className={styles.card} aria-label="Порівняння доходів та витрат">
      <div>
        <p className={styles.eyebrow}>Огляд місяця</p>
        <h2 className={styles.title}>Доходи проти витрат</h2>
      </div>
      {hasData ? (
        <div className={styles.rows}>
          {items.map((item) => (
            <article key={item.id} className={styles.row}>
              <div className={styles.rowHeader}>
                <span>{item.label}</span>
                <strong className={item.id === 'expense' ? styles.expense : styles.income}>
                  {formatMoney(item.id === 'expense' ? -item.amountCents : item.amountCents, {
                    currency: 'грн.',
                    showPlus: item.id === 'income',
                    spacedSign: true,
                  })}
                </strong>
              </div>
              <span className={styles.track}>
                <span
                  className={[styles.bar, item.id === 'expense' ? styles.expenseBar : styles.incomeBar].join(' ')}
                  style={{ width: `${Math.max(item.valuePercent, 4)}%` }}
                />
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Немає доходів або витрат за цей період.</p>
      )}
    </section>
  )
}
