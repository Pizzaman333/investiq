import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import arrowLeftIcon from '../../assets/icons/ui/arrow-left.svg'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { BarChartPlaceholder } from '../../features/reports/components/BarChartPlaceholder/BarChartPlaceholder'
import { CategoryReport } from '../../features/reports/components/CategoryReport/CategoryReport'
import { MonthlyTotals } from '../../features/reports/components/MonthlyTotals/MonthlyTotals'
import { PeriodSelector } from '../../features/reports/components/PeriodSelector/PeriodSelector'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { APP_ROUTES } from '../../shared/constants/routes'
import {
  balanceAmount,
  reportBarsByKind,
  reportCategoriesByKind,
  reportPeriod,
  reportTotals,
} from '../../shared/constants/mockData'
import type { TransactionKind } from '../../shared/types/transaction'
import styles from './ReportsPage.module.css'

export function ReportsPage() {
  const navigate = useNavigate()
  const [activeKind, setActiveKind] = useState<TransactionKind>('expense')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const toggleKind = () => {
    setActiveKind((currentKind) => (currentKind === 'expense' ? 'income' : 'expense'))
  }

  return (
    <>
      <AppLayout
        balanceAmount={balanceAmount}
        onLogout={() => setIsLogoutOpen(true)}
        topLeft={
          <button type="button" className={styles.backLink} onClick={() => navigate(APP_ROUTES.dashboard)}>
            <img src={arrowLeftIcon} alt="" aria-hidden="true" />
            Повернутись на головну
          </button>
        }
        topRight={<PeriodSelector period={reportPeriod} />}
      >
        <MonthlyTotals expenseAmount={reportTotals.expense} incomeAmount={reportTotals.income} />
        <CategoryReport
          kind={activeKind}
          items={reportCategoriesByKind[activeKind]}
          onToggle={toggleKind}
        />
        <BarChartPlaceholder items={reportBarsByKind[activeKind]} />
      </AppLayout>

      <ConfirmModal
        isOpen={isLogoutOpen}
        title="Ви дійсно хочете вийти?"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => navigate(APP_ROUTES.root)}
      />
    </>
  )
}
