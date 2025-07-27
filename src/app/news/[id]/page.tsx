import { Suspense } from 'react'
import { newsItems } from '@/lib/newsData'
import NewsDetailClient from './NewsDetailClient'
import Container from '@/components/Container/Container'
import styles from './news-detail.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

const NewsDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params
  const { id } = resolvedParams

  // 記事の存在確認
  const article = newsItems.find((item) => item.id === id)

  if (!article) {
    return (
      <Container>
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
            記事が見つかりません
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Suspense
        fallback={
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
        }
      >
        <NewsDetailClient id={id} />
      </Suspense>
    </Container>
  )
}

export default NewsDetailPage
