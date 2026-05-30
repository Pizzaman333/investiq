import type { ReactNode } from 'react'
import { BackgroundPattern } from '../../components/BackgroundPattern/BackgroundPattern'
import { Header } from '../../components/Header/Header'
import styles from './AuthLayout.module.css'

export interface AuthLayoutProps {
  hero: ReactNode
  card: ReactNode
}

export function AuthLayout({ hero, card }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <BackgroundPattern />
        <section className={styles.surface}>
          <div className={styles.hero}>{hero}</div>
          <div className={styles.card}>{card}</div>
        </section>
      </main>
    </div>
  )
}
