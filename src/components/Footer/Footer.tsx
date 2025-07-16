import React from 'react'
import styles from './Footer.module.css'
import SnsLinks from '../SnsLinks/SnsLinks'

const Footer = () => {
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
            <p>TEL: 03-1234-5678</p>
          </div>
          <div className={styles.hours}>
            <p>月〜金: 11:00-21:00</p>
            <p>土日祝: 10:00-19:00</p>
          </div>
        </div>
        <div className={styles['footer-right']}>
          <SnsLinks />
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} VDO. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
