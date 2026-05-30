import styles from './MonthlyTotals.module.css'

export interface MonthlyTotalsProps {
  expenseAmount: string
  incomeAmount: string
}

export function MonthlyTotals({ expenseAmount, incomeAmount }: MonthlyTotalsProps) {
  return (
    <section className={styles.totals}>
      <p>
        <span className={styles.label}>Витрати:</span>
        <strong className={styles.expense}>{expenseAmount}</strong>
      </p>
      <span className={styles.divider} aria-hidden="true" />
      <p>
        <span className={styles.label}>Доходи:</span>
        <strong className={styles.income}>{incomeAmount}</strong>
      </p>
    </section>
  )
}
