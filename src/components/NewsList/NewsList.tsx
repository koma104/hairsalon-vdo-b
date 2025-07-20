'use client'

import { useState, forwardRef, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './NewsList.module.css'
import { NewsItem } from '@/lib/newsData'

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
    const moreButtonRefInternal = useRef<HTMLButtonElement>(null)

    const displayedItems = items.slice(0, visibleCount)

    // Intersection Observer for more button animation
    useEffect(() => {
      const moreButton = moreButtonRefInternal.current
      if (!moreButton) return

      let hasTriggered = false // 一度だけ発火するフラグ

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTriggered) {
              hasTriggered = true // 一度発火したらフラグを立てる
              // 実機に最適化した即座の発火
              setIsMoreButtonVisible(true) // 遅延なし
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
                      width={100}
                      height={100}
                      className={styles['news-image']}
                    />
                  </div>
                  <div className={styles['news-text']}>
                    <h3 className={styles['news-subtitle']}>{item.title}</h3>
                    <p className={styles['news-excerpt']}>{item.excerpt}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles['news-text']}>
                    <h3 className={styles['news-subtitle']}>{item.title}</h3>
                    <p className={styles['news-excerpt']}>{item.excerpt}</p>
                  </div>
                  <div className={styles['news-image-wrapper']}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={100}
                      height={100}
                      className={styles['news-image']}
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
            <Link href="/news" className={styles['news-list-button']}>
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
