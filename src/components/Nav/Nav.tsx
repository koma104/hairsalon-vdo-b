import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import styles from './Nav.module.css'
import SnsLinks from '../SnsLinks/SnsLinks'
import { usePageContext } from '@/contexts/PageContext'

const Nav = ({ isOpen, closeMenu }: { isOpen: boolean; closeMenu: () => void }) => {
  const { setCurrentPage } = usePageContext()
  const router = useRouter()
  const pathname = usePathname()

  // 独立ページかどうかを判断
  const isStandalonePage = pathname !== '/' && !pathname.startsWith('/?')

  // ナビゲーション処理
  const handleNavigation = (targetPage: string, href: string) => {
    closeMenu()

    if (isStandalonePage) {
      // 独立ページからの遷移は直接URLナビゲーション
      if (targetPage === 'home') {
        window.location.href = '/'
      } else {
        router.push(href)
      }
    } else {
      // ホームページ内での遷移はPageContextを使用
      if (targetPage === 'home') {
        setCurrentPage('home')
        window.location.replace('/')
      } else {
        setCurrentPage(targetPage as 'home' | 'news' | 'reserve' | 'staff')
      }
    }
  }

  return (
    <nav className={`${styles.nav} ${isOpen ? styles['is-open'] : ''}`}>
      <div className={styles['nav-inner']}>
        <ul className={styles['nav-list']}>
          <li>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleNavigation('home', '/')
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
                handleNavigation('news', '/news')
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
                handleNavigation('reserve', '/reserve')
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
                handleNavigation('staff', '/staff')
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
