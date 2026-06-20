import closeIcon from '../../assets/icons/ui/close.svg'
import { Button } from '../../shared/ui/Button/Button'
import styles from './ConfirmModal.module.css'

export interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'ТАК',
  cancelLabel = 'НІ',
  confirmDisabled = false,
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={isConfirming ? undefined : onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onCancel} aria-label="Закрити" disabled={isConfirming}>
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>
        <p className={styles.title}>{title}</p>
        {description ? <p className={styles.description}>{description}</p> : null}
        <div className={styles.actions}>
          <Button variant="primary" className={styles.action} onClick={onConfirm} disabled={confirmDisabled || isConfirming}>
            {isConfirming ? 'ЗБЕРЕЖЕННЯ...' : confirmLabel}
          </Button>
          <Button variant="secondary" className={styles.action} onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
