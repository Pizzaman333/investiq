import LogoutIcon from '../../assets/icons/ui/logout.svg?react'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import styles from './Header.module.css'

export interface HeaderProps {
  onLogout?: () => void
  username?: string
}

export function Header({ onLogout, username }: HeaderProps) {
  const displayName = username?.trim() || 'User Name'
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="InvestIQ">
        <Logo compact />
      </Link>
      {onLogout ? (
        <div className={styles.profile}>
          <span className={styles.avatar}>{avatarLetter}</span>
          <span className={styles.name}>{displayName}</span>
          <button type="button" className={styles.logout} onClick={onLogout}>
            <span className={styles.logoutText}>Вийти</span>
            <LogoutIcon className={styles.logoutIcon} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </header>
  )
}
