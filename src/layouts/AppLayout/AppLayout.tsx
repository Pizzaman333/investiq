import type { ReactNode } from 'react'
import { BackgroundPattern } from '../../components/BackgroundPattern/BackgroundPattern'
import { BalanceControl } from '../../components/BalanceControl/BalanceControl'
import { Header } from '../../components/Header/Header'
import styles from './AppLayout.module.css'
import type { BalanceControlProps } from '../../components/BalanceControl/BalanceControl'

export interface AppLayoutProps {
  balanceControl: BalanceControlProps
  username?: string
  topLeft?: ReactNode
  topRight?: ReactNode
  onLogout: () => void
  children: ReactNode
}

export function AppLayout({ balanceControl, username, topLeft, topRight, onLogout, children }: AppLayoutProps) {
  return (
    <div className={styles.page}>
      <Header onLogout={onLogout} username={username} />
      <main className={styles.main}>
        <BackgroundPattern />
        <div className={styles.container}>
          <section className={styles.topBar}>
            <div className={styles.side}>{topLeft}</div>
            <div className={styles.center}>
              <BalanceControl {...balanceControl} />
            </div>
            <div className={[styles.side, styles.sideRight].join(' ')}>{topRight}</div>
          </section>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
    </div>
  )
}
