import styles from './DemoBanner.module.css'

export function DemoBanner() {
  return (
    <aside className={styles.banner}>
      <strong>Demo mode</strong>
      <span>Data is local to this session and may reset after a refresh.</span>
    </aside>
  )
}
