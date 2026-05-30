import SpinnerLoader from 'react-spinner-loader'
import styles from './Loader.module.css'

export interface LoaderProps {
  show?: boolean
  message?: string
}

export function Loader({ show = false, message = 'Завантаження...' }: LoaderProps) {
  return (
    <div className={styles.preview}>
      <SpinnerLoader
        show={show}
        type="BOX"
        stack="vertical"
        message={message}
        color={{ primary: '#d9e0f5', secondary: '#ff7a1a' }}
        spinnerSize={34}
      />
    </div>
  )
}
