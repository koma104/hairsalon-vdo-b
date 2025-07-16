'use client'

import React from 'react'
import Image from 'next/image'
import Container from '@/components/Container/Container'

import styles from './NewsDetail.module.css'

// This is mock data. In a real application, you would fetch this based on the `id` param.
const allNews = [
  {
    id: 'summer-hair-refresh',
    title: '夏のヘアリフレッシュ',
    date: '2025-01-15',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'keratin-treatment',
    title: 'ケラチントリートメントの紹介',
    date: '2025-01-14',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'seasonal-hair-trends',
    title: '季節のヘアトレンド',
    date: '2025-01-13',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'hair-care-tips',
    title: 'ヘアケアのコツ',
    date: '2025-01-12',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'special-offer',
    title: '特別オファー',
    date: '2025-01-11',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'professional-hair-treatment',
    title: 'プロフェッショナルヘアトリートメント',
    date: '2025-01-10',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'winter-hair-care',
    title: '冬のヘアケア特集',
    date: '2025-01-09',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'new-year-special',
    title: '新年特別企画',
    date: '2025-01-08',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'spring-collection',
    title: '春コレクション',
    date: '2025-01-07',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'summer-special',
    title: '夏限定サービス',
    date: '2025-01-06',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'autumn-trends',
    title: '秋のトレンド',
    date: '2025-01-05',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'christmas-special',
    title: 'クリスマス特別企画',
    date: '2025-01-04',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'new-year-new-look',
    title: '新年、新しい私',
    date: '2025-01-03',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'valentines-day-style',
    title: 'バレンタインスタイル',
    date: '2025-01-02',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'white-day-gift',
    title: 'ホワイトデーのお返しに',
    date: '2025-01-01',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'graduation-ceremony-hair',
    title: '卒業式のヘアセット',
    date: '2024-12-31',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'entrance-ceremony-style',
    title: '入学式の準備',
    date: '2024-12-30',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'golden-week-offer',
    title: 'ゴールデンウィーク企画',
    date: '2024-12-29',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'mothers-day-present',
    title: '母の日ギフト',
    date: '2024-12-28',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'rainy-season-hair-care',
    title: '梅雨のヘアケア',
    date: '2024-12-27',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'fathers-day-special',
    title: '父の日キャンペーン',
    date: '2024-12-26',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'early-summer-refresh',
    title: '初夏のリフレッシュ',
    date: '2024-12-25',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'tanabata-event',
    title: '七夕イベント',
    date: '2024-12-24',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'obon-holiday-notice',
    title: 'お盆休みのお知らせ',
    date: '2024-12-23',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'autumn-color-campaign',
    title: '秋色カラーキャンペーン',
    date: '2024-12-22',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'respect-for-the-aged-day',
    title: '敬老の日',
    date: '2024-12-21',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'halloween-hair-arrange',
    title: 'ハロウィンアレンジ',
    date: '2024-12-20',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'culture-day-special',
    title: '文化の日',
    date: '2024-12-19',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'end-of-year-hair-care',
    title: '年末ヘアメンテナンス',
    date: '2024-12-18',
    imageUrl: '/images/news-image-05.png',
  },
]

interface NewsDetailProps {
  id: string
  onArticleChange?: (newId: string) => void
}

const NewsDetail = ({ id, onArticleChange }: NewsDetailProps) => {
  if (!id) {
    return <div>Article ID not found</div>
  }
  
  const currentArticleIndex = allNews.findIndex((article) => article.id === id)
  const article = allNews[currentArticleIndex]

  if (!article) {
    return <div>Article not found</div>
  }

  const prevArticle = currentArticleIndex > 0 ? allNews[currentArticleIndex - 1] : null
  const nextArticle =
    currentArticleIndex < allNews.length - 1 ? allNews[currentArticleIndex + 1] : null

  return (
    <Container>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles['section-title']}>{article.title}</h1>
          <p className={styles.date}>{article.date}</p>
        </header>

        <div className={styles['main-image-wrapper']}>
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={750}
            height={422}
            className={styles['main-image']}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.wrapper}>
            <p>本格、髪も心もリフレッシュしませんか？</p>
            <p>
              当サロンでは、この夏限定のカラーサービスを20%オフでご提供しています。紫外線や湿気でダメージを受けやすい季節だからこそ、プロのケアでツヤと潤いを取り戻しましょう。
            </p>
            <p>
              人気の「サマーカラー」や、透明感のあるナチュラルカラーなど、お客様一人ひとりに合わせたご提案をいたします。髪のダメージを抑えるトリートメントもセットでご利用いただけます。
            </p>
          </div>

          <h2 className={styles.subtitle}>おすすめポイント</h2>
          <ul>
            <li>夏限定カラーが20%オフ</li>
            <li>髪のダメージをケアするトリートメント付き</li>
            <li>プロによるカウンセリングで理想のスタイルを実現</li>
          </ul>

          <p>
            今だけの特別キャンペーンです。ご予約・ご相談はお気軽にどうぞ！この夏、輝く髪で新しい自分に出会いましょう。
          </p>
        </div>
      </article>

      <nav className={styles.pagination}>
        {prevArticle ? (
          <button 
            className={styles.prev}
            onClick={() => {
              // PC表示ではホームページ内で記事を切り替える
              const isMobile = window.innerWidth < 768
              if (isMobile) {
                window.location.href = `/news/${prevArticle.id}`
              } else {
                // URLパラメータを更新
                const url = new URL(window.location.href)
                url.searchParams.set('news', prevArticle.id)
                window.history.pushState({}, '', url.toString())
                // 状態を更新して新しい記事を表示
                if (onArticleChange) {
                  onArticleChange(prevArticle.id)
                }
                // ページ上部に一瞬でスクロール
                window.scrollTo(0, 0)
              }
            }}
          >
            &lt; Prev
          </button>
        ) : (
          <span className={`${styles.prev} ${styles.disabled}`}>&lt; Prev</span>
        )}
        {nextArticle ? (
          <button 
            className={styles.next}
            onClick={() => {
              // PC表示ではホームページ内で記事を切り替える
              const isMobile = window.innerWidth < 768
              if (isMobile) {
                window.location.href = `/news/${nextArticle.id}`
              } else {
                // URLパラメータを更新
                const url = new URL(window.location.href)
                url.searchParams.set('news', nextArticle.id)
                window.history.pushState({}, '', url.toString())
                // 状態を更新して新しい記事を表示
                if (onArticleChange) {
                  onArticleChange(nextArticle.id)
                }
                // ページ上部に一瞬でスクロール
                window.scrollTo(0, 0)
              }
            }}
          >
            Next &gt;
          </button>
        ) : (
          <span className={`${styles.next} ${styles.disabled}`}>Next &gt;</span>
        )}
      </nav>
    </Container>
  )
}

export default NewsDetail 