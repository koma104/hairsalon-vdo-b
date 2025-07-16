import React from 'react'
import styles from './Select.module.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  name?: string
  id?: string
}

export default function Select({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false, 
  className = '',
  name,
  id
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`${styles.select} ${!value && placeholder ? styles.placeholder : ''} ${className}`}
      name={name}
      id={id}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
} 