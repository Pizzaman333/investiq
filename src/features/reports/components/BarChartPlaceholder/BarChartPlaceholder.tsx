import type { ChartBarItem } from '../../../../shared/types/report'
import { formatMoney } from '../../../transactions/utils/money'
import styles from './BarChartPlaceholder.module.css'

export interface BarChartPlaceholderProps {
  items: ChartBarItem[]
  emptyMessage?: string
}

export function BarChartPlaceholder({ items, emptyMessage = 'Немає даних за цей період.' }: BarChartPlaceholderProps) {
  return (
    <section className={styles.chart}>
      {items.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`line-${index}`} className={styles.line} />
        ))}
      </div>
      <div className={styles.bars}>
        {items.map((item) => (
          <article key={item.id} className={styles.barItem}>
            <span className={styles.amount}>{formatMoney(item.amountCents, { currency: 'грн.' })}</span>
            <span
              className={[styles.bar, item.highlight ? styles.highlight : styles.soft].join(' ')}
              style={{ height: `${Math.max(item.valuePercent, 8)}%` }}
            />
            <span className={styles.label}>{item.label}</span>
          </article>
        ))}
      </div>
      <div className={styles.mobileList}>
        {items.map((item) => (
          <article key={`${item.id}-mobile`} className={styles.mobileItem}>
            <div className={styles.mobileHeader}>
              <span>{item.label}</span>
              <span>{formatMoney(item.amountCents, { currency: 'грн.' })}</span>
            </div>
            <span className={styles.mobileTrack}>
              <span
                className={[styles.mobileBar, item.highlight ? styles.highlight : styles.soft].join(' ')}
                style={{ width: `${Math.max(item.valuePercent, 8)}%` }}
              />
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
