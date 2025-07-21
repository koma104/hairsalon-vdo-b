'use client'

import { useState, forwardRef, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import styles from './NewsList.module.css'
import { NewsItem } from '@/lib/newsData'
import { usePageContext } from '@/contexts/PageContext'

interface NewsListProps {
  items: NewsItem[]
  maxItems?: number
  maxItemsSp?: number
  maxItemsPc?: number
  showMoreButton?: boolean
  showViewAllButton?: boolean
  onItemClick?: (item: NewsItem) => void
  moreButtonRef?: React.RefObject<HTMLDivElement | null>
  layout?: 'grid' | 'list'
  scrollTriggerRef?: React.RefObject<gsap.plugins.ScrollTriggerInstance | null>
}

const NewsList = forwardRef<HTMLDivElement, NewsListProps>(
  (
    {
      items,
      maxItems,
      maxItemsSp,
      maxItemsPc,
      showMoreButton = false,
      showViewAllButton = false,
      onItemClick,
      moreButtonRef,
      layout = 'list',
      scrollTriggerRef,
    },
    ref
  ) => {
    // 初期値はSSR/CSR共通にするため、maxItemsまたはデフォルト値を使用
    const [visibleCount, setVisibleCount] = useState(maxItems || maxItemsSp || 6)
    const [isMoreButtonVisible, setIsMoreButtonVisible] = useState(false)
    const router = useRouter()
    const { setCurrentPage } = usePageContext()
    const moreButtonRefInternal = useRef<HTMLButtonElement>(null)

    // 初期表示件数の設定（一度だけ）
    useEffect(() => {
      if (maxItemsSp !== undefined && maxItemsPc !== undefined) {
        const isMobile = window.innerWidth < 768
        const initialCount = isMobile ? maxItemsSp : maxItemsPc
        setVisibleCount(initialCount)

        // ホームページでのみアニメーション初期状態を設定
        // ニュース一覧ページでは即座に表示
        if (scrollTriggerRef) {
          // ホームページの場合：アニメーション用の初期状態を設定
          setTimeout(() => {
            if (ref && typeof ref === 'object' && ref.current) {
              const newsItems = ref.current.querySelectorAll('button[class*="news-item"]')
              if (newsItems.length > 0) {
                gsap.set(newsItems, {
                  y: 50,
                  opacity: 0,
                })
              }
            }
          }, 100)
        } else {
          // ニュース一覧ページの場合：即座に表示
          setTimeout(() => {
            if (ref && typeof ref === 'object' && ref.current) {
              const newsItems = ref.current.querySelectorAll('button[class*="news-item"]')
              if (newsItems.length > 0) {
                gsap.set(newsItems, {
                  y: 0,
                  opacity: 1,
                })
              }
            }
          }, 100)
        }
      }
    }, [scrollTriggerRef]) // scrollTriggerRefを依存配列に追加

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

    // 表示制御用のヘルパー関数
    const getCountSettings = () => {
      if (maxItemsSp !== undefined && maxItemsPc !== undefined) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
        const initialCount = isMobile ? maxItemsSp : maxItemsPc
        const addCount = isMobile ? 4 : 6 // SP: 4件、PC: 6件追加
        return { initialCount, addCount, maxCountAfterMore: initialCount + addCount }
      }
      return { initialCount: 6, addCount: 4, maxCountAfterMore: 10 }
    }

    const handleShowMore = () => {
      const { addCount } = getCountSettings()
      const newCount = visibleCount + addCount

      // 新しく追加される要素を最初から非表示状態でレンダリング
      setVisibleCount(newCount)

      // 新しく追加された要素にアニメーションを適用
      setTimeout(() => {
        if (ref && typeof ref === 'object' && ref.current) {
          const newsItems = ref.current.querySelectorAll('button[class*="news-item"]')
          const newItems = Array.from(newsItems).slice(visibleCount, newCount)

          if (newItems.length > 0) {
            if (scrollTriggerRef?.current) {
              // ホームページの場合：アニメーション適用
              // 初期状態を設定
              gsap.set(newItems, {
                y: 50,
                opacity: 0,
              })

              // ScrollTriggerを再実行して新しい要素も含める
              scrollTriggerRef.current.refresh()

              // 新しい要素を直接アニメーション（ScrollTriggerの制御下で）
              newItems.forEach((item, index) => {
                gsap.to(item, {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power2.out',
                  delay: index * 0.1, // 0.1秒ずつ遅延
                })
              })
            } else {
              // ニュース一覧ページの場合：即座に表示
              gsap.set(newItems, {
                y: 0,
                opacity: 1,
              })
            }
          }
        }
      }, 50) // DOM更新を待つ（時間を短縮）
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

        {showMoreButton &&
          (() => {
            const { maxCountAfterMore } = getCountSettings()
            return visibleCount < maxCountAfterMore && visibleCount < items.length
          })() && (
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

        {showViewAllButton &&
          (() => {
            const { maxCountAfterMore } = getCountSettings()
            return visibleCount >= maxCountAfterMore
          })() && (
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
