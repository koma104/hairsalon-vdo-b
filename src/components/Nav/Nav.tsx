import Link from 'next/link'
import styles from './Nav.module.css'
import SnsLinks from '../SnsLinks/SnsLinks'
import { usePageContext } from '@/contexts/PageContext'

const Nav = ({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) => {
  const { setCurrentPage } = usePageContext()

  return (
    <nav className={`${styles.nav} ${isOpen ? styles['is-open'] : ''}`}>
      <div className={styles['nav-inner']}>
        <ul className={styles['nav-list']}>
          <li>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                setCurrentPage('home')
                window.location.replace('/')
              }}
            >
              home
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                setCurrentPage('news')
              }}
            >
              news
            </Link>
          </li>
          <li>
            <Link
              href="/reserve"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                setCurrentPage('reserve')
              }}
            >
              reserve
            </Link>
          </li>
          <li>
            <Link
              href="/staff"
              onClick={(e) => {
                e.preventDefault()
                closeMenu()
                setCurrentPage('staff')
              }}
            >
              staff
            </Link>
          </li>
        </ul>
        <SnsLinks />
      </div>
    </nav>
  )
}

export default Nav
