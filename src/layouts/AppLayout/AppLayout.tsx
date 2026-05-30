import type { ReactNode } from 'react'
import { BackgroundPattern } from '../../components/BackgroundPattern/BackgroundPattern'
import { BalanceControl } from '../../components/BalanceControl/BalanceControl'
import { Header } from '../../components/Header/Header'
import styles from './AppLayout.module.css'

export interface AppLayoutProps {
  balanceAmount: string
  topLeft?: ReactNode
  topRight?: ReactNode
  onLogout: () => void
  children: ReactNode
}

export function AppLayout({ balanceAmount, topLeft, topRight, onLogout, children }: AppLayoutProps) {
  return (
    <div className={styles.page}>
      <Header onLogout={onLogout} />
      <main className={styles.main}>
        <BackgroundPattern />
        <div className={styles.container}>
          <section className={styles.topBar}>
            <div className={styles.side}>{topLeft}</div>
            <div className={styles.center}>
              <BalanceControl amount={balanceAmount} />
            </div>
            <div className={[styles.side, styles.sideRight].join(' ')}>{topRight}</div>
          </section>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
    </div>
  )
}
