import styles from './Loader.module.css'

export interface LoaderProps {
  show?: boolean
  message?: string
}

export function Loader({ show = false, message = 'Завантаження...' }: LoaderProps) {
  if (!show) {
    return null
  }

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
    </div>
  )
}
