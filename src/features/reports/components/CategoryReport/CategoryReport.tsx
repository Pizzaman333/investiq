import alcoholIcon from '../../../../assets/icons/categories/expenses/alcohol.svg'
import educationIcon from '../../../../assets/icons/categories/expenses/education.svg'
import entertainmentIcon from '../../../../assets/icons/categories/expenses/entertainment.svg'
import healthIcon from '../../../../assets/icons/categories/expenses/health.svg'
import homeIcon from '../../../../assets/icons/categories/expenses/home.svg'
import otherIcon from '../../../../assets/icons/categories/expenses/other.svg'
import productsIcon from '../../../../assets/icons/categories/expenses/products.svg'
import sportHobbyIcon from '../../../../assets/icons/categories/expenses/sport-hobby.svg'
import techIcon from '../../../../assets/icons/categories/expenses/tech.svg'
import transportIcon from '../../../../assets/icons/categories/expenses/transport.svg'
import utilitiesIcon from '../../../../assets/icons/categories/expenses/utilities.svg'
import additionalIncomeIcon from '../../../../assets/icons/categories/income/additional-income.svg'
import salaryIcon from '../../../../assets/icons/categories/income/salary.svg'
import chevronLeft from '../../../../assets/icons/ui/chevron-left.svg'
import chevronRight from '../../../../assets/icons/ui/chevron-right.svg'
import type { CategoryTotal } from '../../../../shared/types/report'
import type { TransactionKind } from '../../../../shared/types/transaction'
import { formatMoney } from '../../../transactions/utils/money'
import styles from './CategoryReport.module.css'

export interface CategoryReportProps {
  kind: TransactionKind
  items: CategoryTotal[]
  selectedCategoryId: string
  onToggle: () => void
  onSelect: (categoryId: string) => void
}

const iconByKey: Record<CategoryTotal['icon'], string> = {
  products: productsIcon,
  alcohol: alcoholIcon,
  fun: entertainmentIcon,
  health: healthIcon,
  transport: transportIcon,
  home: homeIcon,
  tech: techIcon,
  utilities: utilitiesIcon,
  'sport-hobby': sportHobbyIcon,
  study: educationIcon,
  other: otherIcon,
  salary: salaryIcon,
  bonus: additionalIncomeIcon,
}

export function CategoryReport({ kind, items, selectedCategoryId, onToggle, onSelect }: CategoryReportProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <button type="button" className={styles.arrow} onClick={onToggle} aria-label="Перемкнути звіт">
          <img src={chevronLeft} alt="" aria-hidden="true" />
        </button>
        <h2>{kind === 'expense' ? 'ВИТРАТИ' : 'ДОХОДИ'}</h2>
        <button type="button" className={styles.arrow} onClick={onToggle} aria-label="Перемкнути звіт">
          <img src={chevronRight} alt="" aria-hidden="true" />
        </button>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={[
              styles.card,
              item.amountCents === 0 ? styles.muted : '',
              selectedCategoryId === item.id ? styles.selected : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onSelect(item.id)}
          >
            <span className={styles.amount}>
              {item.amountCents === 0 ? '—' : formatMoney(item.amountCents, { currency: null })}
            </span>
            <span className={[styles.icon, item.kind === 'expense' ? styles.expenseIcon : styles.incomeIcon].join(' ')}>
              <img src={iconByKey[item.icon]} alt="" aria-hidden="true" />
            </span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
