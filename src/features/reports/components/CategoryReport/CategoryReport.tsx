import AlcoholIcon from '../../../../assets/icons/categories/expenses/alcohol.svg?react'
import EducationIcon from '../../../../assets/icons/categories/expenses/education.svg?react'
import EntertainmentIcon from '../../../../assets/icons/categories/expenses/entertainment.svg?react'
import HealthIcon from '../../../../assets/icons/categories/expenses/health.svg?react'
import HomeIcon from '../../../../assets/icons/categories/expenses/home.svg?react'
import OtherIcon from '../../../../assets/icons/categories/expenses/other.svg?react'
import ProductsIcon from '../../../../assets/icons/categories/expenses/products.svg?react'
import SportHobbyIcon from '../../../../assets/icons/categories/expenses/sport-hobby.svg?react'
import TechIcon from '../../../../assets/icons/categories/expenses/tech.svg?react'
import TransportIcon from '../../../../assets/icons/categories/expenses/transport.svg?react'
import UtilitiesIcon from '../../../../assets/icons/categories/expenses/utilities.svg?react'
import AdditionalIncomeIcon from '../../../../assets/icons/categories/income/additional-income.svg?react'
import SalaryIcon from '../../../../assets/icons/categories/income/salary.svg?react'
import ChevronLeftIcon from '../../../../assets/icons/ui/chevron-left.svg?react'
import ChevronRightIcon from '../../../../assets/icons/ui/chevron-right.svg?react'
import type { ComponentType, SVGProps } from 'react'
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

type CategoryIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const iconByKey: Record<CategoryTotal['icon'], CategoryIconComponent> = {
  products: ProductsIcon,
  alcohol: AlcoholIcon,
  fun: EntertainmentIcon,
  health: HealthIcon,
  transport: TransportIcon,
  home: HomeIcon,
  tech: TechIcon,
  utilities: UtilitiesIcon,
  'sport-hobby': SportHobbyIcon,
  study: EducationIcon,
  other: OtherIcon,
  salary: SalaryIcon,
  bonus: AdditionalIncomeIcon,
}

const toneClassByKey: Partial<Record<CategoryTotal['icon'], string>> = {
  products: styles.productsIcon,
  salary: styles.salaryIcon,
}

export function CategoryReport({ kind, items, selectedCategoryId, onToggle, onSelect }: CategoryReportProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <button type="button" className={styles.arrow} onClick={onToggle} aria-label="Перемкнути звіт">
          <ChevronLeftIcon aria-hidden="true" />
        </button>
        <h2>{kind === 'expense' ? 'ВИТРАТИ' : 'ДОХОДИ'}</h2>
        <button type="button" className={styles.arrow} onClick={onToggle} aria-label="Перемкнути звіт">
          <ChevronRightIcon aria-hidden="true" />
        </button>
      </div>
      <div className={styles.grid}>
        {items.map((item) => {
          const Icon = iconByKey[item.icon]

          return (
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
              <span className={[
                styles.icon,
                item.kind === 'expense' ? styles.expenseIcon : styles.incomeIcon,
                toneClassByKey[item.icon] ?? '',
              ].filter(Boolean).join(' ')}>
                <Icon className={styles.iconGraphic} aria-hidden="true" />
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
