import { Formik } from 'formik'
import CloseIcon from '../../../../assets/icons/ui/close.svg?react'
import type { TransactionDraft, TransactionItem, TransactionKind } from '../../../../shared/types/transaction'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import { Select } from '../../../../shared/ui/Select/Select'
import { CATEGORIES_BY_KIND, getCategory } from '../../utils/categories'
import { getMonthKey } from '../../utils/dates'
import { formatMoney, parseMoneyToCents } from '../../utils/money'
import styles from './EditTransactionModal.module.css'

interface EditTransactionValues {
  kind: TransactionKind
  date: string
  description: string
  categoryId: string
  amount: string
}

export interface EditTransactionModalProps {
  transaction: TransactionItem | null
  isSaving: boolean
  error?: string
  onClose: () => void
  onSubmit: (transactionId: string, draft: TransactionDraft) => Promise<boolean>
}

function getInitialValues(transaction: TransactionItem): EditTransactionValues {
  return {
    kind: transaction.kind,
    date: transaction.date,
    description: transaction.description,
    categoryId: transaction.categoryId,
    amount: formatMoney(transaction.amountCents, { currency: null }),
  }
}

export function EditTransactionModal({
  transaction,
  isSaving,
  error,
  onClose,
  onSubmit,
}: EditTransactionModalProps) {
  if (!transaction) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={isSaving ? undefined : onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Редагувати операцію"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрити" disabled={isSaving}>
          <CloseIcon aria-hidden="true" />
        </button>
        <h2 className={styles.title}>Редагувати операцію</h2>
        <Formik
          initialValues={getInitialValues(transaction)}
          validate={(values) => {
            const errors: Partial<Record<keyof EditTransactionValues, string>> = {}
            const amountCents = parseMoneyToCents(values.amount)

            if (values.kind !== 'expense' && values.kind !== 'income') {
              errors.kind = 'Оберіть тип.'
            }
            if (!values.date || !getMonthKey(values.date)) {
              errors.date = 'Оберіть коректну дату.'
            }
            if (!values.description.trim()) {
              errors.description = 'Введіть опис.'
            }
            if (!values.categoryId || !getCategory(values.kind, values.categoryId)) {
              errors.categoryId = 'Оберіть категорію.'
            }
            if (!values.amount.trim()) {
              errors.amount = 'Введіть суму.'
            } else if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
              errors.amount = 'Введіть суму, більшу за 0.'
            }

            return errors
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const category = getCategory(values.kind, values.categoryId)
            const amountCents = parseMoneyToCents(values.amount)

            if (!category || !Number.isSafeInteger(amountCents) || amountCents <= 0) {
              setSubmitting(false)
              return
            }

            const saved = await onSubmit(transaction.id, {
              kind: values.kind,
              date: values.date,
              description: values.description.trim(),
              categoryId: category.id,
              categoryName: category.name,
              amountCents,
            })

            setSubmitting(false)
            if (saved) {
              onClose()
            }
          }}
        >
          {({ values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
              <Select
                label="Тип:"
                name="kind"
                value={values.kind}
                onChange={(event) => {
                  handleChange(event)
                  void setFieldValue('categoryId', '')
                }}
                onBlur={handleBlur}
                disabled={isSaving || isSubmitting}
                error={touched.kind ? errors.kind : undefined}
                options={[
                  { label: 'Витрата', value: 'expense' },
                  { label: 'Дохід', value: 'income' },
                ]}
              />
              <Input
                label="Дата:"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSaving || isSubmitting}
                error={touched.date ? errors.date : undefined}
              />
              <Input
                label="Опис:"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSaving || isSubmitting}
                error={touched.description ? errors.description : undefined}
              />
              <Select
                label="Категорія:"
                name="categoryId"
                value={values.categoryId}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSaving || isSubmitting}
                error={touched.categoryId ? errors.categoryId : undefined}
                options={[
                  { label: 'Оберіть категорію', value: '' },
                  ...CATEGORIES_BY_KIND[values.kind].map((category) => ({
                    label: category.name,
                    value: category.id,
                  })),
                ]}
              />
              <Input
                label="Сума:"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSaving || isSubmitting}
                inputMode="decimal"
                error={touched.amount ? errors.amount : undefined}
              />
              {error ? <p className={styles.error}>{error}</p> : null}
              <div className={styles.actions}>
                <Button type="submit" variant="primary" disabled={isSaving || isSubmitting}>
                  {isSaving || isSubmitting ? 'ЗБЕРЕЖЕННЯ...' : 'ЗБЕРЕГТИ'}
                </Button>
                <Button type="button" variant="secondary" disabled={isSaving || isSubmitting} onClick={onClose}>
                  СКАСУВАТИ
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}
