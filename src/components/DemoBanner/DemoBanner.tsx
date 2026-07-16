import styles from './DemoBanner.module.css'

export function DemoBanner() {
  return (
    <aside className={styles.banner}>
      <strong>Демо-режим</strong>
      <span>Дані локальні для цієї сесії та можуть скидатися після перезавантаження.</span>
    </aside>
  )
}
