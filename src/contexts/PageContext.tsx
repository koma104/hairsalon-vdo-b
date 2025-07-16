'use client'

import React, { createContext, useContext, useState } from 'react'

interface PageContextType {
  currentPage: string
  setCurrentPage: (page: string) => void
  isSPAEnabled: boolean
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}

interface PageProviderProps {
  children: React.ReactNode
  isSPAEnabled?: boolean
}

export const PageProvider: React.FC<PageProviderProps> = ({ 
  children, 
  isSPAEnabled = false 
}) => {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage, isSPAEnabled }}>
      {children}
    </PageContext.Provider>
  )
} 