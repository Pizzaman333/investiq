import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CalculatorIcon from '../../assets/icons/ui/calculator.svg?react'
import ChartBarsIcon from '../../assets/icons/ui/chart-bars.svg?react'
import CloseIcon from '../../assets/icons/ui/close.svg?react'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { useFinanceMutations } from '../../features/finance/hooks/useFinanceMutations'
import { useFinanceState } from '../../features/finance/hooks/useFinanceState'
import { useCurrentBalance } from '../../features/finance/hooks/useCurrentBalance'
import { useAuth } from '../../features/auth/useAuth'
import { SummaryPanel } from '../../features/transactions/components/SummaryPanel/SummaryPanel'
import { TransactionForm } from '../../features/transactions/components/TransactionForm/TransactionForm'
import { TransactionTable } from '../../features/transactions/components/TransactionTable/TransactionTable'
import { TransactionTabs } from '../../features/transactions/components/TransactionTabs/TransactionTabs'
import { useTransactionMutations } from '../../features/transactions/hooks/useTransactionMutations'
import { useTransactions } from '../../features/transactions/hooks/useTransactions'
import { getMonthlyTotals } from '../../features/transactions/utils/aggregations'
import { formatMoney, parseMoneyToCents } from '../../features/transactions/utils/money'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { dismissBalanceHint, isBalanceHintDismissed } from '../../shared/lib/profileStorage'
import { APP_ROUTES } from '../../shared/constants/routes'
import type { TransactionItem, TransactionKind } from '../../shared/types/transaction'
import { Loader } from '../../shared/ui/Loader/Loader'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { profile, user, signOutUser } = useAuth()
  const uid = user?.uid
  const { state: financeState, loading: financeLoading, error: financeError } = useFinanceState(uid)
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions(uid)
  const { addTransaction, removeTransaction, saving, deletingId, error: transactionMutationError } = useTransactionMutations(uid)
  const { setBaseBalance, updating: balanceUpdating, error: balanceMutationError } = useFinanceMutations(uid)
  const currentBalanceCents = useCurrentBalance(financeState.baseBalanceCents, transactions)
  const [activeKind, setActiveKind] = useState<TransactionKind>('expense')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [closedHintForUid, setClosedHintForUid] = useState<string | null>(null)
  const [isBalanceEditing, setIsBalanceEditing] = useState(false)
  const [balanceDraft, setBalanceDraft] = useState('')
  const [balanceInputError, setBalanceInputError] = useState('')
  const [pendingBaseBalanceCents, setPendingBaseBalanceCents] = useState<number | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionItem | null>(null)

  const visibleTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.kind === activeKind),
    [activeKind, transactions],
  )
  const summaries = useMemo(
    () => getMonthlyTotals(transactions, activeKind).slice(0, 6),
    [activeKind, transactions],
  )

  if (!profile || !uid) {
    return null
  }

  if (financeLoading || transactionsLoading) {
    return <Loader show message="Завантаження фінансів..." />
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
      setBalanceInputError('Введіть коректну суму.')
      return
    }

    setBalanceInputError('')
    setPendingBaseBalanceCents(parsedCents)
  }

  async function confirmBaseBalance() {
    if (pendingBaseBalanceCents === null) {
      return
    }

    const saved = await setBaseBalance(pendingBaseBalanceCents)
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

    const deleted = await removeTransaction(transactionToDelete.id)
    if (deleted) {
      setTransactionToDelete(null)
    }
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
        username={profile.displayName ?? user.displayName ?? 'User Name'}
        onLogout={() => setIsLogoutOpen(true)}
        topRight={
          <button type="button" className={styles.reportsLink} onClick={() => navigate(APP_ROUTES.reports)}>
            Перейти до розрахунків
            <ChartBarsIcon aria-hidden="true" />
          </button>
        }
      >
        {showBalanceHint ? (
          <div className={styles.hintRow}>
            <div className={styles.mobileHint}>
              <button
                type="button"
                className={styles.mobileHintClose}
                aria-label="Закрити підказку"
                onClick={() => {
                  dismissBalanceHint(profile.uid)
                  setClosedHintForUid(profile.uid)
                }}
              >
                <CloseIcon aria-hidden="true" />
              </button>
              <p className={styles.mobileHintTitle}>Підтвердіть базовий баланс для точніших підсумків.</p>
              <p className={styles.mobileHintText}>Доходи й витрати можна додавати вже зараз, навіть якщо баланс ще не підтверджено.</p>
            </div>
          </div>
        ) : null}
        <section className={styles.card}>
          <TransactionTabs activeKind={activeKind} onChange={setActiveKind} />
          <div className={styles.panel}>
            <TransactionForm
              key={activeKind}
              kind={activeKind}
              calculatorIcon={CalculatorIcon}
              isSaving={saving}
              error={transactionMutationError}
              onSubmit={addTransaction}
            />
            <div className={styles.content}>
              <TransactionTable
                kind={activeKind}
                items={visibleTransactions}
                error={transactionsError || financeError}
                deletingId={deletingId}
                onDelete={setTransactionToDelete}
              />
              <SummaryPanel kind={activeKind} items={summaries} />
            </div>
          </div>
        </section>
      </AppLayout>

      <ConfirmModal
        isOpen={pendingBaseBalanceCents !== null}
        title="Змінити базовий баланс?"
        description="Введена сума буде встановлена як новий базовий баланс. Уся історія доходів і витрат залишиться без змін та буде врахована поверх цього балансу."
        confirmLabel="ПІДТВЕРДИТИ"
        cancelLabel="СКАСУВАТИ"
        isConfirming={balanceUpdating}
        onCancel={() => setPendingBaseBalanceCents(null)}
        onConfirm={() => void confirmBaseBalance()}
      />

      <ConfirmModal
        isOpen={transactionToDelete !== null}
        title="Ви впевнені?"
        description={transactionToDelete ? `Операцію «${transactionToDelete.description}» буде видалено.` : undefined}
        isConfirming={Boolean(deletingId)}
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={() => void confirmTransactionDelete()}
      />

      <ConfirmModal
        isOpen={isLogoutOpen}
        title="Ви дійсно хочете вийти?"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          void signOutUser().then(() => navigate(APP_ROUTES.root))
        }}
      />
    </>
  )
}
