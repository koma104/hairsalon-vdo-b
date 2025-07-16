import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { PageProvider } from '@/contexts/PageContext'
import './globals.css'

export const metadata: Metadata = {
  title: '美容室VDO | 渋谷のヘアサロン',
  description: '渋谷の美容室VDO。カット・カラー・パーマ・ヘッドスパなど、あなたの美しさを引き出すサロンです。ご予約・スタッフ紹介・最新ニュースも掲載。',
  keywords: ['美容室', 'ヘアサロン', '渋谷', 'カット', 'カラー', 'パーマ', 'ヘッドスパ', 'VDO'],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: '美容室VDO | 渋谷のヘアサロン',
    description: '渋谷の美容室VDO。カット・カラー・パーマ・ヘッドスパなど、あなたの美しさを引き出すサロンです。ご予約・スタッフ紹介・最新ニュースも掲載。',
    url: 'https://hairsalon-vdo.vercel.app/',
    siteName: '美容室VDO',
    images: [
      {
        url: '/images/ogp.png',
        width: 1200,
        height: 630,
        alt: '美容室VDOのイメージ画像',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '美容室VDO | 渋谷のヘアサロン',
    description: '渋谷の美容室VDO。カット・カラー・パーマ・ヘッドスパなど、あなたの美しさを引き出すサロンです。',
    images: ['/images/ogp.png'],
    site: '@your_twitter_id', // 必要に応じて変更
  },
  metadataBase: new URL('https://hairsalon-vdo.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Figtree:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PageProvider isSPAEnabled={true}>
          <Header />
          <main data-nextjs-scroll-focus-boundary>{children}</main>
          <Footer />
        </PageProvider>
        {/* 開発環境でのNext.jsスクロール警告を抑制 */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (args[0] && typeof args[0] === 'string' && 
                      args[0].includes('Skipping auto-scroll behavior due to')) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
