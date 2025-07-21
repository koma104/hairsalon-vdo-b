'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { newsItems } from '@/lib/newsData'
import styles from './news-detail.module.css'

const NewsDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // パラメータを取得
    params.then(({ id }) => setId(id))
  }, [params])

  // ページ遷移時のスクロールリセットとbody高さクリア
  useEffect(() => {
    // ページ遷移時にスクロール位置をトップにリセット
    window.scrollTo(0, 0)

    console.log('🔍 [News Detail] pathname:', pathname)
    console.log('🔍 [News Detail] Body height before:', document.body?.style.height)

    if (document.body) {
      console.log('🔧 [News Detail] body heightをクリアします')

      // 複数の方法でクリア
      document.body.style.height = ''
      document.body.style.minHeight = ''
      document.body.style.maxHeight = ''
      document.body.removeAttribute('style')

      // 強制的に再計算
      document.body.style.height = 'auto'
      document.body.style.minHeight = 'auto'

      console.log('🔧 [News Detail] After - style height:', document.body.style.height)

      // ScrollSmootherもクリーンアップ
      const windowWithGSAP = window as typeof window & {
        ScrollSmoother?: { getAll?: () => unknown[] }
      }
      const allScrollSmoothers = windowWithGSAP.ScrollSmoother?.getAll?.() || []
      allScrollSmoothers.forEach((smoother: unknown) => {
        if (
          smoother &&
          typeof smoother === 'object' &&
          'kill' in smoother &&
          typeof smoother.kill === 'function'
        ) {
          console.log('🔧 [News Detail] ScrollSmootherをkillしました')
          smoother.kill()
        }
      })
    }
  }, [pathname, id])

  // 初期化中またはIDが取得できていない場合はローディング状態を表示
  if (!id) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            fontSize: 'var(--font-sm)',
            color: 'var(--color-gray-30)',
          }}
        >
          読み込み中...
        </div>
      </div>
    )
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
    <div className={styles.container}>
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
          <Link href={`/news/${prevArticle.id}`} className={styles.prev}>
            <svg width="40" height="40" viewBox="0 0 32 32" className="arrow-svg">
              <polyline
                points="20,8 12,16 20,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Prev
          </Link>
        ) : (
          <span className={`${styles.prev} ${styles.disabled}`}>
            <svg width="40" height="40" viewBox="0 0 32 32" className="arrow-svg">
              <polyline
                points="20,8 12,16 20,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Prev
          </span>
        )}
        {nextArticle ? (
          <Link href={`/news/${nextArticle.id}`} className={styles.next}>
            Next
            <svg width="40" height="40" viewBox="0 0 32 32" className="arrow-svg">
              <polyline
                points="12,8 20,16 12,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </Link>
        ) : (
          <span className={`${styles.next} ${styles.disabled}`}>
            Next
            <svg width="40" height="40" viewBox="0 0 32 32" className="arrow-svg">
              <polyline
                points="12,8 20,16 12,24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
        )}
      </nav>
    </div>
  )
}

export default NewsDetailPage
