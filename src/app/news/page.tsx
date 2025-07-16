'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './news.module.css'
import { newsItems } from '@/lib/newsData'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import Container from '@/components/Container/Container'
import NewsList from '@/components/NewsList/NewsList'

const ITEMS_PER_PAGE = 10

// useSearchParamsを使用するコンポーネントを分離
const NewsListContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  
  // URLパラメータからページ番号を取得
  const pageParam = searchParams.get('page')
  const initialPage = pageParam ? parseInt(pageParam, 10) : 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  useEffect(() => {
    // デバイス判定
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // URLパラメータの変更を監視
  useEffect(() => {
    const pageParam = searchParams.get('page')
    const newPage = pageParam ? parseInt(pageParam, 10) : 1
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }, [searchParams, currentPage])

  // ページが変更された時にトップにスクロール
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo(0, 0)
    }
  }, [currentPage])

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, newsItems.length)
  const displayedItems = newsItems.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      // URLパラメータを更新
      const url = new URL(window.location.href)
      url.searchParams.set('page', newPage.toString())
      window.history.pushState({}, '', url.toString())
      // ページトップにスクロール
      window.scrollTo(0, 0)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      // URLパラメータを更新
      const url = new URL(window.location.href)
      if (newPage === 1) {
        url.searchParams.delete('page')
      } else {
        url.searchParams.set('page', newPage.toString())
      }
      window.history.pushState({}, '', url.toString())
      // ページトップにスクロール
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <NewsList
        items={displayedItems}
        maxItems={ITEMS_PER_PAGE}
        onItemClick={(item) => {
          if (isMobile) {
            // SPの場合は独立したページに遷移
            router.push(`/news/${item.id}`)
          } else {
            // PCの場合はホームページのcontent-wrapper内で表示
            router.push(`/?news=${item.id}`)
          }
        }}
      />

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={styles['page-button']}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className={styles['arrow-svg']}>
              <polyline points="20,8 12,16 20,24" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <span>
            {currentPage} / {totalPages} ページ
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles['page-button']}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className={styles['arrow-svg']}>
              <polyline points="12,8 20,16 12,24" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

// ローディング状態のコンポーネント
const NewsListLoading = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    読み込み中...
  </div>
)

const NewsListPage = () => {
  return (
    <Container>
      <SectionTitle>news</SectionTitle>
      <Suspense fallback={<NewsListLoading />}>
        <NewsListContent />
      </Suspense>
    </Container>
  )
}

export default NewsListPage
