import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CalculatorIcon from '../../assets/icons/ui/calculator.svg?react'
import ChartBarsIcon from '../../assets/icons/ui/chart-bars.svg?react'
import CloseIcon from '../../assets/icons/ui/close.svg?react'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { DemoBanner } from '../../components/DemoBanner/DemoBanner'
import { useFinanceMutations } from '../../features/finance/hooks/useFinanceMutations'
import { useFinanceState } from '../../features/finance/hooks/useFinanceState'
import { useCurrentBalance } from '../../features/finance/hooks/useCurrentBalance'
import { useAuth } from '../../features/auth/useAuth'
import { useDemoData } from '../../features/demo/useDemoData'
import { EditTransactionModal } from '../../features/transactions/components/EditTransactionModal/EditTransactionModal'
import { SummaryPanel } from '../../features/transactions/components/SummaryPanel/SummaryPanel'
import { TransactionForm } from '../../features/transactions/components/TransactionForm/TransactionForm'
import { TransactionTable } from '../../features/transactions/components/TransactionTable/TransactionTable'
import { TransactionTabs } from '../../features/transactions/components/TransactionTabs/TransactionTabs'
import { useTransactionMutations } from '../../features/transactions/hooks/useTransactionMutations'
import { useTransactions } from '../../features/transactions/hooks/useTransactions'
import { getMonthlyTotals } from '../../features/transactions/utils/aggregations'
import { CATEGORIES_BY_KIND } from '../../features/transactions/utils/categories'
import { getPeriodInfo } from '../../features/transactions/utils/dates'
import {
  EMPTY_TRANSACTION_FILTERS,
  filterTransactions,
  hasActiveTransactionFilters,
  type TransactionFilters,
  type TransactionTypeFilter,
} from '../../features/transactions/utils/filters'
import { formatMoney, parseMoneyToCents } from '../../features/transactions/utils/money'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { dismissBalanceHint, isBalanceHintDismissed } from '../../shared/lib/profileStorage'
import { APP_ROUTES } from '../../shared/constants/routes'
import type { TransactionDraft, TransactionItem, TransactionKind } from '../../shared/types/transaction'
import { Button } from '../../shared/ui/Button/Button'
import { Input } from '../../shared/ui/Input/Input'
import { Loader } from '../../shared/ui/Loader/Loader'
import { Select } from '../../shared/ui/Select/Select'
import styles from './DashboardPage.module.css'

const initialFilters: TransactionFilters = {
  ...EMPTY_TRANSACTION_FILTERS,
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { mode, profile, user, signOutUser } = useAuth()
  const demo = useDemoData()
  const isDemo = mode === 'demo'
  const firebaseUid = isDemo ? undefined : user?.uid
  const { state: firebaseFinanceState, loading: financeLoading, error: financeError } = useFinanceState(firebaseUid)
  const { transactions: firebaseTransactions, loading: transactionsLoading, error: transactionsError } = useTransactions(firebaseUid)
  const {
    addTransaction: addFirebaseTransaction,
    removeTransaction: removeFirebaseTransaction,
    updateExistingTransaction,
    saving,
    deletingId,
    updatingId,
    error: transactionMutationError,
  } = useTransactionMutations(firebaseUid)
  const { setBaseBalance: setFirebaseBaseBalance, updating: balanceUpdating, error: balanceMutationError } = useFinanceMutations(firebaseUid)
  const financeState = isDemo ? demo.financeState : firebaseFinanceState
  const transactions = isDemo ? demo.transactions : firebaseTransactions
  const currentBalanceCents = useCurrentBalance(financeState.baseBalanceCents, transactions)
  const [activeKind, setActiveKind] = useState<TransactionKind>('expense')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [closedHintForUid, setClosedHintForUid] = useState<string | null>(null)
  const [isBalanceEditing, setIsBalanceEditing] = useState(false)
  const [balanceDraft, setBalanceDraft] = useState('')
  const [balanceInputError, setBalanceInputError] = useState('')
  const [pendingBaseBalanceCents, setPendingBaseBalanceCents] = useState<number | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionItem | null>(null)
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionItem | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters)

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [filters, transactions],
  )
  const summaries = useMemo(
    () => getMonthlyTotals(transactions, activeKind).slice(0, 6),
    [activeKind, transactions],
  )
  const monthOptions = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.monthKey))]
      .sort()
      .reverse()
      .map((monthKey) => {
        const period = getPeriodInfo(monthKey)
        return {
          label: `${period.month} ${period.year}`,
          value: monthKey,
        }
      }),
    [transactions],
  )
  const categoryOptions = useMemo(() => {
    const kinds: TransactionKind[] = filters.type === 'all' ? ['expense', 'income'] : [filters.type]
    return kinds.flatMap((kind) =>
      CATEGORIES_BY_KIND[kind].map((category) => ({
        label: `${category.name}${filters.type === 'all' ? ` (${kind === 'expense' ? 'expense' : 'income'})` : ''}`,
        value: category.id,
      })),
    )
  }, [filters.type])
  const hasFilters = hasActiveTransactionFilters(filters)

  if (!profile || (!isDemo && !firebaseUid)) {
    return null
  }

  if (!isDemo && (financeLoading || transactionsLoading)) {
    return <Loader show message="Loading finances..." />
  }

  const showBalanceHint =
    !financeState.balanceConfirmed &&
    !isBalanceHintDismissed(profile.uid) &&
    closedHintForUid !== profile.uid

  function startBalanceEditing() {
    setBalanceDraft(formatMoney(financeState.baseBalanceCents, { currency: null }))
    setBalanceInputError('')
    setIsBalanceEditing(true)
  }

  function requestBalanceConfirmation() {
    const parsedCents = parseMoneyToCents(balanceDraft)
    if (!Number.isSafeInteger(parsedCents)) {
      setBalanceInputError('Enter a valid amount.')
      return
    }

    setBalanceInputError('')
    setPendingBaseBalanceCents(parsedCents)
  }

  async function confirmBaseBalance() {
    if (pendingBaseBalanceCents === null) {
      return
    }

    const saved = isDemo
      ? await demo.setBaseBalance(pendingBaseBalanceCents)
      : await setFirebaseBaseBalance(pendingBaseBalanceCents)
    if (saved) {
      setPendingBaseBalanceCents(null)
      setBalanceDraft('')
      setIsBalanceEditing(false)
    }
  }

  async function confirmTransactionDelete() {
    if (!transactionToDelete) {
      return
    }

    const deleted = isDemo
      ? await demo.removeTransaction(transactionToDelete.id)
      : await removeFirebaseTransaction(transactionToDelete.id)
    if (deleted) {
      setTransactionToDelete(null)
      setFeedbackMessage('Transaction deleted.')
    }
  }

  async function handleCreateTransaction(draft: TransactionDraft) {
    const saved = isDemo
      ? await demo.addTransaction(draft)
      : await addFirebaseTransaction(draft)
    if (saved) {
      setFeedbackMessage('Transaction added.')
    }
    return saved
  }

  async function handleUpdateTransaction(transactionId: string, draft: TransactionDraft) {
    const saved = isDemo
      ? await demo.updateTransaction(transactionId, draft)
      : await updateExistingTransaction(transactionId, draft)
    if (saved) {
      setFeedbackMessage('Transaction updated.')
    }
    return saved
  }

  function handleKindChange(kind: TransactionKind) {
    const previousKind = activeKind
    setActiveKind(kind)
    setFilters((currentFilters) => ({
      ...currentFilters,
      type: currentFilters.type === previousKind ? kind : currentFilters.type,
      categoryId:
        currentFilters.type !== previousKind ||
        CATEGORIES_BY_KIND[kind].some((category) => category.id === currentFilters.categoryId)
          ? currentFilters.categoryId
          : '',
    }))
  }

  function setTypeFilter(type: TransactionTypeFilter) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      type,
      categoryId:
        type === 'all' || CATEGORIES_BY_KIND[type].some((category) => category.id === currentFilters.categoryId)
          ? currentFilters.categoryId
          : '',
    }))
  }

  return (
    <>
      <AppLayout
        balanceControl={{
          amount: formatMoney(currentBalanceCents, { currency: 'UAH' }),
          draftValue: balanceDraft,
          isEditing: isBalanceEditing,
          isNegative: currentBalanceCents < 0,
          error: balanceInputError || balanceMutationError,
          actionDisabled: !isBalanceEditing || balanceDraft.trim() === '' || balanceUpdating,
          onEditStart: startBalanceEditing,
          onDraftChange: setBalanceDraft,
          onConfirm: requestBalanceConfirmation,
        }}
        username={profile.displayName ?? user?.displayName ?? 'User Name'}
        onLogout={() => setIsLogoutOpen(true)}
        topRight={
          <button type="button" className={styles.reportsLink} onClick={() => navigate(APP_ROUTES.reports)}>
            Go to reports
            <ChartBarsIcon aria-hidden="true" />
          </button>
        }
      >
        {isDemo ? <DemoBanner /> : null}
        {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}
        {showBalanceHint ? (
          <div className={styles.hintRow}>
            <div className={styles.mobileHint}>
              <button
                type="button"
                className={styles.mobileHintClose}
                aria-label="Close hint"
                onClick={() => {
                  dismissBalanceHint(profile.uid)
                  setClosedHintForUid(profile.uid)
                }}
              >
                <CloseIcon aria-hidden="true" />
              </button>
              <p className={styles.mobileHintTitle}>Confirm your baseline balance for more accurate totals.</p>
              <p className={styles.mobileHintText}>You can add income and expenses now, even before confirming the balance.</p>
            </div>
          </div>
        ) : null}
        <section className={styles.card}>
          <TransactionTabs activeKind={activeKind} onChange={handleKindChange} />
          <div className={styles.panel}>
            <TransactionForm
              key={activeKind}
              kind={activeKind}
              calculatorIcon={CalculatorIcon}
              isSaving={isDemo ? false : saving}
              error={isDemo ? '' : transactionMutationError}
              onSubmit={handleCreateTransaction}
            />
            <section className={styles.filters} aria-label="Transaction filters">
              <Select
                label="Month"
                value={filters.monthKey}
                onChange={(event) => setFilters((currentFilters) => ({
                  ...currentFilters,
                  monthKey: event.target.value,
                }))}
                options={[
                  { label: 'All months', value: '' },
                  ...monthOptions,
                ]}
              />
              <Select
                label="Type"
                value={filters.type}
                onChange={(event) => setTypeFilter(event.target.value as TransactionTypeFilter)}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Expenses', value: 'expense' },
                  { label: 'Income', value: 'income' },
                ]}
              />
              <Select
                label="Category"
                value={filters.categoryId}
                onChange={(event) => setFilters((currentFilters) => ({
                  ...currentFilters,
                  categoryId: event.target.value,
                }))}
                options={[
                  { label: 'All categories', value: '' },
                  ...categoryOptions,
                ]}
              />
              <Input
                label="Search"
                value={filters.query}
                placeholder="Search by description"
                onChange={(event) => setFilters((currentFilters) => ({
                  ...currentFilters,
                  query: event.target.value,
                }))}
              />
              <Button
                type="button"
                variant="secondary"
                className={styles.clearFilters}
                disabled={!hasFilters}
                onClick={() => setFilters(initialFilters)}
              >
                CLEAR
              </Button>
            </section>
            <div className={styles.content}>
              <TransactionTable
                kind={activeKind}
                items={visibleTransactions}
                error={transactionsError || financeError}
                deletingId={deletingId}
                updatingId={updatingId}
                emptyMessage={hasFilters ? 'No transactions match these filters.' : 'No transactions yet.'}
                onEdit={setTransactionToEdit}
                onDelete={setTransactionToDelete}
              />
              <SummaryPanel kind={activeKind} items={summaries} />
            </div>
          </div>
        </section>
      </AppLayout>

      <ConfirmModal
        isOpen={pendingBaseBalanceCents !== null}
        title="Change baseline balance?"
        description="The entered amount will become the new baseline balance. Your income and expense history will stay unchanged and will be calculated on top of this balance."
        confirmLabel="CONFIRM"
        cancelLabel="CANCEL"
        isConfirming={balanceUpdating}
        onCancel={() => setPendingBaseBalanceCents(null)}
        onConfirm={() => void confirmBaseBalance()}
      />

      <ConfirmModal
        isOpen={transactionToDelete !== null}
        title="Are you sure?"
        description={transactionToDelete ? `The transaction “${transactionToDelete.description}” will be deleted.` : undefined}
        isConfirming={Boolean(deletingId)}
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={() => void confirmTransactionDelete()}
      />

      <EditTransactionModal
        transaction={transactionToEdit}
        isSaving={isDemo ? false : updatingId === transactionToEdit?.id}
        error={isDemo ? '' : transactionMutationError}
        onClose={() => setTransactionToEdit(null)}
        onSubmit={handleUpdateTransaction}
      />

      <ConfirmModal
        isOpen={isLogoutOpen}
        title="Do you really want to log out?"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          void signOutUser().then(() => navigate(APP_ROUTES.root))
        }}
      />
    </>
  )
}
