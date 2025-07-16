import Link from 'next/link'
import styles from './Nav.module.css'
import SnsLinks from '../SnsLinks/SnsLinks'

const Nav = ({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) => (
  <nav className={`${styles.nav} ${isOpen ? styles['is-open'] : ''}`}>
    <div className={styles['nav-inner']}>
      <ul className={styles['nav-list']}>
        <li>
          <Link 
            href="/" 
            onClick={(e) => {
              e.preventDefault()
              closeMenu()
              window.location.replace('/')
            }}
          >
            home
          </Link>
        </li>
        <li>
          <Link href="/news" onClick={closeMenu}>
            news
          </Link>
        </li>
        <li>
          <Link href="/reserve" onClick={closeMenu}>
            reserve
          </Link>
        </li>
        <li>
          <Link href="/staff" onClick={closeMenu}>
            staff
          </Link>
        </li>
      </ul>
      <SnsLinks />
    </div>
  </nav>
)

export default Nav
