import { LoginCard } from '../../features/auth/components/LoginCard/LoginCard'
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout'
import styles from './WelcomePage.module.css'

export function WelcomePage() {
  return (
    <AuthLayout
      hero={
        <div className={styles.hero}>
          <h1 className={styles.title}>InvestIQ</h1>
          <p className={styles.subtitle}>SMART FINANCE</p>
        </div>
      }
      card={<LoginCard />}
    />
  )
}
