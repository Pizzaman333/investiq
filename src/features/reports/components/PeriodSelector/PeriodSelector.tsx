import type { PeriodInfo } from '../../../../shared/types/report'
import styles from './PeriodSelector.module.css'

export interface PeriodSelectorProps {
  period: PeriodInfo
}

export function PeriodSelector({ period }: PeriodSelectorProps) {
  return (
    <div className={styles.selector}>
      <span className={styles.caption}>Поточний період</span>
      <div className={styles.row}>
        <button type="button" className={styles.arrow} aria-label="Попередній період">
          ‹
        </button>
        <div className={styles.value}>
          <strong>{period.month}</strong>
          <span>{period.year}</span>
        </div>
        <button type="button" className={styles.arrow} aria-label="Наступний період">
          ›
        </button>
      </div>
    </div>
  )
}
