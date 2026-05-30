import type { ReportBarItem } from '../../../../shared/types/report'
import styles from './BarChartPlaceholder.module.css'

export interface BarChartPlaceholderProps {
  items: ReportBarItem[]
}

export function BarChartPlaceholder({ items }: BarChartPlaceholderProps) {
  return (
    <section className={styles.chart}>
      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={`line-${index}`} className={styles.line} />
        ))}
      </div>
      <div className={styles.bars}>
        {items.map((item) => (
          <article key={item.id} className={styles.barItem}>
            <span className={styles.amount}>{item.amount}</span>
            <span
              className={[styles.bar, item.highlight ? styles.highlight : styles.soft].join(' ')}
              style={{ height: `${Math.max(item.value, 8)}%` }}
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
              <span>{item.amount}</span>
            </div>
            <span className={styles.mobileTrack}>
              <span
                className={[styles.mobileBar, item.highlight ? styles.highlight : styles.soft].join(' ')}
                style={{ width: `${Math.max(item.value, 8)}%` }}
              />
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
