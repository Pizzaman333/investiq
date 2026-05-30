import logoutIcon from '../../assets/icons/ui/logout.svg'
import { Link } from 'react-router-dom'
import { Logo } from '../Logo/Logo'
import styles from './Header.module.css'

export interface HeaderProps {
  onLogout?: () => void
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="InvestIQ">
        <Logo compact />
      </Link>
      {onLogout ? (
        <div className={styles.profile}>
          <span className={styles.avatar}>U</span>
          <span className={styles.name}>User Name</span>
          <button type="button" className={styles.logout} onClick={onLogout}>
            <span className={styles.logoutText}>Вийти</span>
            <img className={styles.logoutIcon} src={logoutIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </header>
  )
}
