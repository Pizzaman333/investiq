import ChevronLeftIcon from '../../../../assets/icons/ui/chevron-left.svg?react'
import ChevronRightIcon from '../../../../assets/icons/ui/chevron-right.svg?react'
import type { PeriodInfo } from '../../../../shared/types/report'
import styles from './PeriodSelector.module.css'

export interface PeriodSelectorProps {
  period: PeriodInfo
  nextDisabled?: boolean
  onPrevious: () => void
  onNext: () => void
}

export function PeriodSelector({ period, nextDisabled = false, onPrevious, onNext }: PeriodSelectorProps) {
  return (
    <div className={styles.selector}>
      <span className={styles.caption}>Поточний період</span>
      <div className={styles.row}>
        <button type="button" className={styles.arrow} aria-label="Попередній період" onClick={onPrevious}>
          <ChevronLeftIcon aria-hidden="true" />
        </button>
        <div className={styles.value}>
          <strong>{period.month}</strong>
          <span>{period.year}</span>
        </div>
        <button type="button" className={styles.arrow} aria-label="Наступний період" onClick={onNext} disabled={nextDisabled}>
          <ChevronRightIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
