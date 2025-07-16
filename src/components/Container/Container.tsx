import { ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps {
  children: ReactNode
  className?: string
}

const Container = ({ children, className = '' }: ContainerProps) => {
  const containerClass = `${styles.container} ${className}`.trim()
  
  return (
    <div className={containerClass}>
      {children}
    </div>
  )
}

export default Container 