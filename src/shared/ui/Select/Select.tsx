import chevronDown from '../../../assets/icons/ui/chevron-down.svg'
import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ label: string; value: string }>
}

export function Select({ label, id, options, className = '', ...props }: SelectProps) {
  const selectId = id ?? label ?? props.name

  return (
    <label className={styles.field} htmlFor={selectId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.wrapper}>
        <select id={selectId} className={[styles.select, className].filter(Boolean).join(' ')} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img className={styles.chevron} src={chevronDown} alt="" aria-hidden="true" />
      </span>
    </label>
  )
}
