import React, { forwardRef } from 'react'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  children: React.ReactNode
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const SectionTitle = forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ children, tag: Tag = 'h1' }, ref) => {
    return <Tag ref={ref} className={styles['section-title']}>{children}</Tag>
  }
)

SectionTitle.displayName = 'SectionTitle'

export default SectionTitle 