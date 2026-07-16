import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowLeftIcon from '../../assets/icons/ui/arrow-left.svg?react'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { DemoBanner } from '../../components/DemoBanner/DemoBanner'
import { useAuth } from '../../features/auth/useAuth'
import { useDemoData } from '../../features/demo/useDemoData'
import { useFinanceMutations } from '../../features/finance/hooks/useFinanceMutations'
import { useFinanceState } from '../../features/finance/hooks/useFinanceState'
import { useCurrentBalance } from '../../features/finance/hooks/useCurrentBalance'
import { BarChartPlaceholder } from '../../features/reports/components/BarChartPlaceholder/BarChartPlaceholder'
import { CategoryReport } from '../../features/reports/components/CategoryReport/CategoryReport'
import { MonthlyComparison } from '../../features/reports/components/MonthlyComparison/MonthlyComparison'
import { MonthlyTotals } from '../../features/reports/components/MonthlyTotals/MonthlyTotals'
import { PeriodSelector } from '../../features/reports/components/PeriodSelector/PeriodSelector'
import { TopCategories } from '../../features/reports/components/TopCategories/TopCategories'
import { useReportData } from '../../features/reports/hooks/useReportData'
import { useTransactions } from '../../features/transactions/hooks/useTransactions'
import { getCategoryTotals } from '../../features/transactions/utils/aggregations'
import { getCurrentMonthKey, getPeriodInfo, shiftMonthKey } from '../../features/transactions/utils/dates'
import { formatMoney, parseMoneyToCents } from '../../features/transactions/utils/money'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { APP_ROUTES } from '../../shared/constants/routes'
import type { TransactionKind } from '../../shared/types/transaction'
import { Loader } from '../../shared/ui/Loader/Loader'
import styles from './ReportsPage.module.css'

export function ReportsPage() {
  const navigate = useNavigate()
  const { mode, profile, user, signOutUser } = useAuth()
  const demo = useDemoData()
  const isDemo = mode === 'demo'
  const firebaseUid = isDemo ? undefined : user?.uid
  const { state: firebaseFinanceState, loading: financeLoading, error: financeError } = useFinanceState(firebaseUid)
  const { transactions: firebaseTransactions, loading: transactionsLoading, error: transactionsError } = useTransactions(firebaseUid)
  const { setBaseBalance: setFirebaseBaseBalance, updating: balanceUpdating, error: balanceMutationError } = useFinanceMutations(firebaseUid)
  const financeState = isDemo ? demo.financeState : firebaseFinanceState
  const transactions = isDemo ? demo.transactions : firebaseTransactions
  const currentBalanceCents = useCurrentBalance(financeState.baseBalanceCents, transactions)
  const [activeKind, setActiveKind] = useState<TransactionKind>('expense')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [periodOverride, setPeriodOverride] = useState<string | null>(null)
  const [categorySelection, setCategorySelection] = useState<{ context: string; id: string } | null>(null)
  const [isBalanceEditing, setIsBalanceEditing] = useState(false)
  const [balanceDraft, setBalanceDraft] = useState('')
  const [balanceInputError, setBalanceInputError] = useState('')
  const [pendingBaseBalanceCents, setPendingBaseBalanceCents] = useState<number | null>(null)

  const availableMonthKeys = useMemo(
    () => [...new Set(transactions.map((transaction) => transaction.monthKey))].sort().reverse(),
    [transactions],
  )
  const currentMonthKey = getCurrentMonthKey()
  const defaultMonthKey = availableMonthKeys.includes(currentMonthKey)
    ? currentMonthKey
    : availableMonthKeys[0] ?? currentMonthKey
  const selectedMonthKey = periodOverride ?? defaultMonthKey
  const period = getPeriodInfo(selectedMonthKey)
  const categories = useMemo(
    () => getCategoryTotals(transactions, activeKind, selectedMonthKey),
    [activeKind, selectedMonthKey, transactions],
  )
  const selectionContext = `${activeKind}:${selectedMonthKey}`
  const defaultCategoryId = categories.find((category) => category.amountCents > 0)?.id ?? categories[0]?.id ?? ''
  const selectedCategoryId = categorySelection?.context === selectionContext
    ? categorySelection.id
    : defaultCategoryId
  const reportData = useReportData(transactions, activeKind, selectedMonthKey, selectedCategoryId)
  const nextMonthKey = shiftMonthKey(selectedMonthKey, 1)
  const nextDisabled = nextMonthKey > currentMonthKey && !availableMonthKeys.includes(nextMonthKey)

  if (!profile || (!isDemo && !firebaseUid)) {
    return null
  }

  if (!isDemo && (financeLoading || transactionsLoading)) {
    return <Loader show message="Завантаження звіту..." />
  }

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
    const saved = isDemo
      ? await demo.setBaseBalance(pendingBaseBalanceCents)
      : await setFirebaseBaseBalance(pendingBaseBalanceCents)
    if (saved) {
      setPendingBaseBalanceCents(null)
      setBalanceDraft('')
      setIsBalanceEditing(false)
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
        username={profile.displayName ?? user?.displayName ?? 'User Name'}
        onLogout={() => setIsLogoutOpen(true)}
        topLeft={
          <button type="button" className={styles.backLink} onClick={() => navigate(APP_ROUTES.dashboard)}>
            <ArrowLeftIcon aria-hidden="true" />
            Повернутись на головну
          </button>
        }
        topRight={
          <PeriodSelector
            period={period}
            nextDisabled={nextDisabled}
            onPrevious={() => setPeriodOverride(shiftMonthKey(selectedMonthKey, -1))}
            onNext={() => {
              if (!nextDisabled) {
                setPeriodOverride(nextMonthKey)
              }
            }}
          />
        }
      >
        {isDemo ? <DemoBanner /> : null}
        {financeError || transactionsError ? <p className={styles.error}>{financeError || transactionsError}</p> : null}
        <MonthlyTotals
          expenseAmount={formatMoney(-reportData.expenseTotalCents, { currency: 'грн.', spacedSign: true })}
          incomeAmount={formatMoney(reportData.incomeTotalCents, { currency: 'грн.', showPlus: true, spacedSign: true })}
        />
        <div className={styles.insights}>
          <MonthlyComparison items={reportData.comparisonItems} />
          <TopCategories kind={activeKind} items={reportData.topCategories} />
        </div>
        <CategoryReport
          kind={activeKind}
          items={categories}
          selectedCategoryId={selectedCategoryId}
          onToggle={() => setActiveKind((currentKind) => currentKind === 'expense' ? 'income' : 'expense')}
          onSelect={(id) => setCategorySelection({ context: selectionContext, id })}
        />
        <BarChartPlaceholder items={reportData.chartItems} />
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
        isOpen={isLogoutOpen}
        title="Ви дійсно хочете вийти?"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => void signOutUser().then(() => navigate(APP_ROUTES.root))}
      />
    </>
  )
}
