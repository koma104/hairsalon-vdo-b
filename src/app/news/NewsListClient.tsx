'use client'

import { useState, useEffect } from 'react'
import { newsItems } from '@/lib/newsData'
import NewsList from '@/components/NewsList/NewsList'
import styles from './news.module.css'

const ITEMS_PER_PAGE = 20

const NewsListClient = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isClient, setIsClient] = useState(false)

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true)
    // URLパラメータからページ番号を取得
    const pageParam = new URLSearchParams(window.location.search).get('page')
    const initialPage = pageParam ? parseInt(pageParam, 10) : 1
    setCurrentPage(initialPage)
  }, [])

  // URLパラメータの変更を監視
  useEffect(() => {
    if (!isClient) return

    const pageParam = new URLSearchParams(window.location.search).get('page')
    const newPage = pageParam ? parseInt(pageParam, 10) : 1
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }, [currentPage, isClient])

  // ページが変更された時にトップにスクロール
  useEffect(() => {
    if (!isClient) return

    if (currentPage > 1) {
      window.scrollTo(0, 0)
    }
  }, [currentPage, isClient])

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, newsItems.length)
  const displayedItems = newsItems.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (!isClient) return

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
    if (!isClient) return

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
        layout="grid"
        onItemClick={async (item) => {
          if (!isClient) return
          // シンプルな遷移処理
          window.location.href = `/news/${item.id}`
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
              <polyline
                points="20,8 12,16 20,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
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
              <polyline
                points="12,8 20,16 12,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default NewsListClient
