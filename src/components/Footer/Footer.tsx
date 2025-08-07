'use client'

import React from 'react'
import styles from './Footer.module.css'
import SnsLinks from '../SnsLinks/SnsLinks'
import ArrowUpIcon from '../icons/ArrowUpIcon'
import { usePageContext } from '@/contexts/PageContext'

const Footer = () => {
  const { isInitialized } = usePageContext()

  if (!isInitialized) {
    return null
  }

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-wrapper']}>
        <div className={styles['footer-left']}>
          <div className={styles.info}>
            <p>
              〒150-0000
              <br />
              東京都渋谷区渋谷1-2-3 渋谷ビルディング103-A
            </p>
            <a
              href="https://maps.google.com/?q=東京都渋谷区渋谷1-2-3+渋谷ビルディング103-A"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['access-link']}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={styles['access-icon']}
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              Google map
            </a>
            <p>TEL: 03-1234-5678</p>
          </div>
          <div className={styles.hours}>
            <p>月〜金: 11:00-21:00</p>
            <p>土日祝: 10:00-19:00</p>
          </div>
        </div>
        <div className={styles['footer-right']}>
          <div className={styles['footer-content']}>
            <SnsLinks variant="footer" />
            <div className={styles.copyright}>
              <p>&copy; {new Date().getFullYear()} VDO. All Rights Reserved.</p>
            </div>
          </div>
          <button
            className={styles['scroll-to-top']}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="ページトップに戻る"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
