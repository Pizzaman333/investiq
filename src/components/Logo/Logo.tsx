import styles from './Logo.module.css'

export interface LogoProps {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className={[styles.logo, compact ? styles.compact : ''].filter(Boolean).join(' ')}>
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.wordmark}>INVESTIQ</span>
    </div>
  )
}
