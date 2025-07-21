'use client'

import { useState, forwardRef, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './NewsList.module.css'
import { NewsItem } from '@/lib/newsData'
import { usePageContext } from '@/contexts/PageContext'

interface NewsListProps {
  items: NewsItem[]
  maxItems?: number
  showMoreButton?: boolean
  showViewAllButton?: boolean
  onItemClick?: (item: NewsItem) => void
  moreButtonRef?: React.RefObject<HTMLDivElement | null>
  layout?: 'grid' | 'list'
}

const NewsList = forwardRef<HTMLDivElement, NewsListProps>(
  (
    {
      items,
      maxItems,
      showMoreButton = false,
      showViewAllButton = false,
      onItemClick,
      moreButtonRef,
      layout = 'list',
    },
    ref
  ) => {
    const [visibleCount, setVisibleCount] = useState(maxItems || 4)
    const [isMoreButtonVisible, setIsMoreButtonVisible] = useState(false)
    const router = useRouter()
    const { setCurrentPage } = usePageContext()
    const moreButtonRefInternal = useRef<HTMLButtonElement>(null)

    const displayedItems = items.slice(0, visibleCount)

    // Intersection Observer for more button animation
    useEffect(() => {
      const moreButton = moreButtonRefInternal.current
      if (!moreButton) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 画面に入った時にアニメーション開始
              setIsMoreButtonVisible(true)
            } else {
              // 画面から出た時にアニメーションリセット
              setIsMoreButtonVisible(false)
            }
          })
        },
        {
          threshold: 0.1, // 10%で発火
          rootMargin: '0px 0px -200px 0px',
        }
      )

      observer.observe(moreButton)

      return () => {
        observer.disconnect()
      }
    }, [])

    const handleItemClick = (item: NewsItem) => {
      if (onItemClick) {
        onItemClick(item)
      } else {
        const isMobile = window.innerWidth < 768
        if (isMobile) {
          router.push(`/news/${item.id}`)
        } else {
          router.push(`/?news=${item.id}`)
        }
      }
    }

    const handleShowMore = () => {
      setVisibleCount(8)
    }

    return (
      <div ref={ref}>
        <div
          className={`${styles['news-list']} ${layout === 'grid' ? styles['news-list-grid'] : styles['news-list-list']}`}
        >
          {displayedItems.map((item) => (
            <button
              key={item.id}
              className={`${styles['news-item']} ${layout === 'grid' ? styles['news-item-grid'] : styles['news-item-list']}`}
              onClick={() => handleItemClick(item)}
            >
              {layout === 'grid' ? (
                <>
                  <div className={styles['news-image-wrapper']}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className={styles['news-image']}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles['news-text']}>
                    <h3 className={styles['news-title']}>{item.title}</h3>
                    <p className={styles['news-date']}>{item.date}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles['news-text']}>
                    <h3 className={styles['news-title']}>{item.title}</h3>
                    <p className={styles['news-date']}>{item.date}</p>
                  </div>
                  <div className={styles['news-image-wrapper']}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className={styles['news-image']}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        {showMoreButton && visibleCount < 8 && visibleCount < items.length && (
          <div ref={moreButtonRef} className={styles['more-button-wrapper']}>
            <button
              ref={moreButtonRefInternal}
              onClick={handleShowMore}
              className={`${styles['more-button']} ${isMoreButtonVisible ? styles.active : ''}`}
            >
              more
            </button>
          </div>
        )}

        {showViewAllButton && visibleCount >= 8 && (
          <div ref={moreButtonRef} className={styles['more-button-wrapper']}>
            <Link
              href="/news"
              className={styles['news-list-button']}
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage('news')
              }}
            >
              すべて見る
            </Link>
          </div>
        )}
      </div>
    )
  }
)

NewsList.displayName = 'NewsList'

export default NewsList
