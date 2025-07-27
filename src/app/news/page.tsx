import { Suspense } from 'react'
import Container from '@/components/Container/Container'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import NewsListClient from './NewsListClient'
import styles from './news.module.css'

const NewsListPage = () => {
  return (
    <Container>
      <div className={styles['section-title-wrapper']}>
        <SectionTitle disableAnimation={true}>news</SectionTitle>
      </div>
      <Suspense
        fallback={
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
        }
      >
        <NewsListClient />
      </Suspense>
    </Container>
  )
}

export default NewsListPage
