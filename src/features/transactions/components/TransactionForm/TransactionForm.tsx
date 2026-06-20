import calendarIcon from '../../../../assets/icons/ui/calendar.svg'
import { Formik } from 'formik'
import type { TransactionDraft, TransactionKind } from '../../../../shared/types/transaction'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import { Select } from '../../../../shared/ui/Select/Select'
import { CATEGORIES_BY_KIND, getCategory } from '../../utils/categories'
import { getMonthKey, getTodayIsoDate } from '../../utils/dates'
import { parseMoneyToCents } from '../../utils/money'
import styles from './TransactionForm.module.css'

export interface TransactionFormProps {
  kind: TransactionKind
  calculatorIcon?: string
  isSaving: boolean
  error?: string
  onSubmit: (draft: TransactionDraft) => Promise<boolean>
}

interface TransactionFormValues {
  date: string
  description: string
  categoryId: string
  amount: string
}

function getInitialValues(): TransactionFormValues {
  return {
    date: getTodayIsoDate(),
    description: '',
    categoryId: '',
    amount: '',
  }
}

export function TransactionForm({ kind, calculatorIcon, isSaving, error, onSubmit }: TransactionFormProps) {
  const categoryOptions = CATEGORIES_BY_KIND[kind].map((category) => ({
    label: category.name,
    value: category.id,
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
      initialValues={getInitialValues()}
      validate={(values) => {
        const errors: Partial<Record<keyof TransactionFormValues, string>> = {}
        const amountCents = parseMoneyToCents(values.amount)

        if (!values.date || !getMonthKey(values.date)) {
          errors.date = 'Оберіть коректну дату.'
        }
        if (!values.description.trim()) {
          errors.description = 'Введіть опис.'
        }
        if (!values.categoryId) {
          errors.categoryId = 'Оберіть категорію.'
        }
        if (!values.amount.trim()) {
          errors.amount = 'Введіть суму.'
        } else if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
          errors.amount = 'Введіть суму, більшу за 0.'
        }

        return errors
      }}
      onSubmit={async (values, { setSubmitting, setValues }) => {
        const category = getCategory(kind, values.categoryId)
        const amountCents = parseMoneyToCents(values.amount)

        if (!category || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
          setSubmitting(false)
          return
        }

        const saved = await onSubmit({
          kind,
          date: values.date,
          description: values.description.trim(),
          categoryId: category.id,
          categoryName: category.name,
          amountCents,
        })

        if (saved) {
          await setValues({
            date: values.date,
            description: '',
            categoryId: '',
            amount: '',
          })
        }
        setSubmitting(false)
      }}
    >
      {({ values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit, setValues }) => (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.dateField}>
            <img className={styles.calendar} src={calendarIcon} alt="" aria-hidden="true" />
            <input
              className={styles.dateInput}
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSaving || isSubmitting}
              aria-label="Дата транзакції"
            />
            {touched.date && errors.date ? <span className={styles.dateError}>{errors.date}</span> : null}
          </div>
          <div className={styles.inputs}>
            <Input
              className={styles.textInput}
              name="description"
              placeholder={placeholders.description}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description ? errors.description : undefined}
              disabled={isSaving || isSubmitting}
            />
            <Select
              className={styles.selectInput}
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.categoryId ? errors.categoryId : undefined}
              disabled={isSaving || isSubmitting}
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
              onBlur={handleBlur}
              error={touched.amount ? errors.amount : undefined}
              disabled={isSaving || isSubmitting}
              inputMode="decimal"
            />
            {calculatorIcon ? <img className={styles.calculator} src={calculatorIcon} alt="" aria-hidden="true" /> : null}
          </div>
          {error ? <p className={styles.formError}>{error}</p> : null}
          <div className={styles.actions}>
            <Button type="submit" variant="primary" disabled={isSaving || isSubmitting}>
              {isSaving || isSubmitting ? 'ЗБЕРЕЖЕННЯ...' : 'ВВЕСТИ'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isSaving || isSubmitting}
              onClick={() => void setValues({ date: values.date, description: '', categoryId: '', amount: '' })}
            >
              ОЧИСТИТИ
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
