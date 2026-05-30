import calendarIcon from '../../../../assets/icons/ui/calendar.svg'
import { Formik } from 'formik'
import { expenseCategories, incomeCategories, transactionInitialValues } from '../../../../shared/constants/mockData'
import type { TransactionKind } from '../../../../shared/types/transaction'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import { Select } from '../../../../shared/ui/Select/Select'
import styles from './TransactionForm.module.css'

export interface TransactionFormProps {
  kind: TransactionKind
  calculatorIcon?: string
}

export function TransactionForm({ kind, calculatorIcon }: TransactionFormProps) {
  const categoryOptions = (kind === 'expense' ? expenseCategories : incomeCategories).map((category) => ({
    label: category,
    value: category,
  }))

  const placeholders =
    kind === 'expense'
      ? {
          description: 'Опис товару',
          category: 'Категорія товару',
        }
      : {
          description: 'Опис прибутку',
          category: 'Категорія прибутку',
        }

  return (
    <Formik
      enableReinitialize
      initialValues={transactionInitialValues[kind]}
      onSubmit={(values) => {
        void values
      }}
    >
      {({ values, handleChange, handleSubmit, resetForm }) => (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.dateField}>
            <img className={styles.calendar} src={calendarIcon} alt="" aria-hidden="true" />
            <span className={styles.date}>{values.date}</span>
          </div>
          <div className={styles.inputs}>
            <Input
              className={styles.textInput}
              name="description"
              placeholder={placeholders.description}
              value={values.description}
              onChange={handleChange}
            />
            <Select
              className={styles.selectInput}
              name="category"
              value={values.category}
              onChange={handleChange}
              options={[
                { label: placeholders.category, value: '' },
                ...categoryOptions,
              ]}
            />
            <Input
              className={styles.amountInput}
              name="amount"
              placeholder="0,00"
              value={values.amount}
              onChange={handleChange}
            />
            {calculatorIcon ? <img className={styles.calculator} src={calculatorIcon} alt="" aria-hidden="true" /> : null}
          </div>
          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              ВВЕСТИ
            </Button>
            <Button type="button" variant="secondary" onClick={() => resetForm()}>
              ОЧИСТИТИ
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
