'use client'

import React from 'react'
import Image from 'next/image'
import Container from '@/components/Container/Container'
import { newsItems } from '@/lib/newsData'

import styles from './NewsDetail.module.css'

interface NewsDetailProps {
  id: string
  onArticleChange?: (newId: string) => void
}

const NewsDetail = ({ id, onArticleChange }: NewsDetailProps) => {
  if (!id) {
    return <div>Article ID not found</div>
  }

  const currentArticleIndex = newsItems.findIndex((article) => article.id === id)
  const article = newsItems[currentArticleIndex]

  if (!article) {
    return <div>Article not found</div>
  }

  const prevArticle = currentArticleIndex > 0 ? newsItems[currentArticleIndex - 1] : null
  const nextArticle =
    currentArticleIndex < newsItems.length - 1 ? newsItems[currentArticleIndex + 1] : null

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
