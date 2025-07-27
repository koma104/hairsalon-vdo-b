import React from 'react'

interface ArrowUpIconProps {
  className?: string
}

const ArrowUpIcon: React.FC<ArrowUpIconProps> = ({ className = '' }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className={className}>
      <polyline points="4,10 8,6 12,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default ArrowUpIcon
