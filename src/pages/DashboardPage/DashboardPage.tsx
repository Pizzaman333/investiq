import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import calculatorIcon from '../../assets/icons/ui/calculator.svg'
import chartBarsIcon from '../../assets/icons/ui/chart-bars.svg'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
import { SummaryPanel } from '../../features/transactions/components/SummaryPanel/SummaryPanel'
import { TransactionForm } from '../../features/transactions/components/TransactionForm/TransactionForm'
import { TransactionTable } from '../../features/transactions/components/TransactionTable/TransactionTable'
import { TransactionTabs } from '../../features/transactions/components/TransactionTabs/TransactionTabs'
import { AppLayout } from '../../layouts/AppLayout/AppLayout'
import { APP_ROUTES } from '../../shared/constants/routes'
import { balanceAmount, summaryByKind, transactionsByKind } from '../../shared/constants/mockData'
import type { TransactionKind } from '../../shared/types/transaction'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const [activeKind, setActiveKind] = useState<TransactionKind>('expense')
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  return (
    <>
      <AppLayout
        balanceAmount={balanceAmount}
        onLogout={() => setIsLogoutOpen(true)}
        topRight={
          <button type="button" className={styles.reportsLink} onClick={() => navigate(APP_ROUTES.reports)}>
            Перейти до розрахунків
            <img src={chartBarsIcon} alt="" aria-hidden="true" />
          </button>
        }
      >
        <div className={styles.mobileHint}>
          <p className={styles.mobileHintTitle}>Привіт! Для початку роботи внесіть свій поточний баланс рахунку!</p>
          <p className={styles.mobileHintText}>Ви не можете витрачати гроші, поки їх у Вас немає :)</p>
        </div>
        <section className={styles.card}>
          <TransactionTabs activeKind={activeKind} onChange={setActiveKind} />
          <div className={styles.panel}>
            <TransactionForm kind={activeKind} calculatorIcon={calculatorIcon} />
            <div className={styles.content}>
              <TransactionTable kind={activeKind} items={transactionsByKind[activeKind]} />
              <SummaryPanel kind={activeKind} items={summaryByKind[activeKind]} />
            </div>
          </div>
        </section>
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
