import closeIcon from '../../assets/icons/ui/close.svg'
import { Button } from '../../shared/ui/Button/Button'
import styles from './ConfirmModal.module.css'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  confirmLabel = 'ТАК',
  cancelLabel = 'НІ',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onCancel} aria-label="Закрити">
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>
        <p className={styles.title}>{title}</p>
        <div className={styles.actions}>
          <Button variant="primary" className={styles.action} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" className={styles.action} onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
