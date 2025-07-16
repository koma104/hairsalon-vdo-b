'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.css'
import { newsItems } from '@/lib/newsData'
import Button from '@/components/Button/Button'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Lenis from 'lenis'
import NewsListPage from './news/page'
import NewsDetail from '@/components/NewsDetail/NewsDetail'
import ReservePage from './reserve/page'
import StaffPage from './staff/page'
import NewsList from '@/components/NewsList/NewsList'
import Container from '@/components/Container/Container'
import { usePageContext } from '@/contexts/PageContext'

const menuCategories = [
  {
    category: 'cuts',
    items: [
      { name: '[Regular]', price: '¥6,600' },
      { name: '[Under18]', price: '¥5,800' },
      { name: '[Bangs]', price: '¥3,300' },
    ],
  },
  {
    category: 'color',
    items: [
      { name: '[Color]', price: '¥8,800' },
      { name: '[Perm]', price: '¥8,800' },
      { name: '[Straight perm]', price: '¥15,000' },
      { name: '[Relaxing]', price: '¥20,000' },
      { name: '[Digital perm]', price: '¥18,000' },
    ],
  },
  {
    category: 'other',
    items: [
      { name: '[Treatment]', price: '¥4,400~' },
      { name: '[Head spa]', price: '¥5,500~' },
    ],
  },
]

// useSearchParamsを使用するコンポーネント
function HomeContent() {
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null)
  const { currentPage, setCurrentPage } = usePageContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // アニメーション用のref
  const conceptSectionRef = useRef<HTMLElement>(null)
  const conceptTitleRef = useRef<HTMLHeadingElement>(null)
  const conceptCatchphraseRef = useRef<HTMLHeadingElement>(null)
  const conceptTextRef = useRef<HTMLParagraphElement>(null)
  
  // ニュースセクション用のref
  const newsSectionRef = useRef<HTMLElement>(null)
  const newsTitleRef = useRef<HTMLHeadingElement>(null)
  const newsListRef = useRef<HTMLDivElement>(null)
  const newsMoreButtonRef = useRef<HTMLDivElement>(null)
  
  // メニューセクション用のref
  const menuSectionRef = useRef<HTMLElement>(null)
  const menuTitleRef = useRef<HTMLHeadingElement>(null)
  const menuWrapperRef = useRef<HTMLDivElement>(null)

  // ヒーローテキスト用のref
  const mainVisualTextRef = useRef<HTMLDivElement>(null);

  // URLパラメータを監視してニュース詳細を表示（newsクエリパラメータのみ）
  useEffect(() => {
    const newsQueryParam = searchParams.get('news')
    
    if (newsQueryParam) {
      setCurrentArticleId(newsQueryParam)
      setCurrentPage('news')
    } else {
      setCurrentArticleId(null)
    }
  }, [searchParams, setCurrentPage])

  // PCでの直接アクセス時の処理は削除（記事詳細ページで処理する）

  useEffect(() => {
    // DOMが完全にマウントされるまで少し待つ
    const timer = setTimeout(() => {
      // デバイス判定
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768

      // Lenisインスタンスを作成（慣性スクロール）
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2, // スマホではより短いduration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !isMobile, // スマホではsmoothWheelを無効化
        wheelMultiplier: isMobile ? 0.8 : 1, // スマホではホイール感度を調整
      })

      // requestAnimationFrameループでLenisを更新
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      // ScrollTriggerにLenisのスクロールを連携
      lenis.on('scroll', ScrollTrigger.update)
      
      // ScrollTriggerインスタンスを個別管理
      const scrollTriggers: ScrollTrigger[] = []

      // パララックス効果：ヒーロー画像のアニメーション
      let heroParallaxAnimation: gsap.core.Tween | null = null
      
      // 要素が存在することを確認してからアニメーションを実行
      const mainImageElement = document.querySelector(`.${styles['main-image']}`)
      const mainVisualElement = document.querySelector(`.${styles['main-visual']}`)
      const contentWrapperElement = document.querySelector(`.${styles['content-wrapper']}`)

      let contentAnimation: gsap.core.Tween | null = null

    if (mainImageElement && mainVisualElement) {
      // パララックス効果：ヒーロー画像のアニメーション（PC・スマホ両方で適用）
      heroParallaxAnimation = gsap.to(mainImageElement, {
        yPercent: isMobile ? -5 : -10, // スマホでは軽微な効果
        ease: 'none',
        scrollTrigger: {
          trigger: mainVisualElement,
          start: 'top top',
          end: 'bottom top',
          scrub: isMobile ? 0.5 : 1, // スマホではより滑らかなスクラブ
        },
      })
      
      gsap.fromTo(mainImageElement, 
        { scale: 1.1 },
        { 
          scale: 1, 
          duration: 1.5, 
          delay: 0, 
          ease: 'power2.out' 
        }
      )
    }

    if (contentWrapperElement) {
      gsap.set(contentWrapperElement, {
        y: '0vh',
      })

      contentAnimation = gsap.to(contentWrapperElement, {
        scrollTrigger: {
          trigger: contentWrapperElement,
          start: 'top bottom-=100',
          end: 'bottom top+=100',
          scrub: 1,
        },
        y: 0,
      })
    }

          // コンセプトセクションのアニメーション
      if (conceptSectionRef.current && conceptTitleRef.current && conceptCatchphraseRef.current) {
        // 初期状態を設定（p要素は除外）
        gsap.set([conceptTitleRef.current, conceptCatchphraseRef.current], {
          opacity: 0,
          y: 15
        })

      // 下からふわっと表示アニメーション
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: conceptSectionRef.current,
          start: 'top bottom-=200',
          end: 'bottom top+=100',
          toggleActions: 'play none none reverse'
        }
      })

      // h2タイトル（opacity + 下から移動）
      if (conceptTitleRef.current) {
        tl.to(conceptTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out'
        }, 0.05) // ディレイを短縮
      }

      // h3キャッチフレーズ（opacity + 下から移動）
      if (conceptCatchphraseRef.current) {
        tl.to(conceptCatchphraseRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power2.out'
        }, '-=0.8') // 重複時間を調整
      }

      // コンセプトテキスト（行ごとに表示）
      if (conceptTextRef.current) {
        // span要素を取得
        const spans = conceptTextRef.current.querySelectorAll('span')
        
        // 初期状態を設定
        spans.forEach(span => {
          gsap.set(span, {
            opacity: 0
          })
        })
        
        // 各行を順番にアニメーション
        spans.forEach((span, index) => {
          tl.to(span, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
          }, `-=${index === 0 ? 0.6 : 0.4}`) // 重複時間を短縮
        })
      }
    }

    // ニュースセクションのアニメーション
    if (newsSectionRef.current && newsTitleRef.current && newsListRef.current && newsMoreButtonRef.current) {
      // 初期状態を設定
      gsap.set([newsTitleRef.current, newsListRef.current, newsMoreButtonRef.current], {
        opacity: 0
      })
      gsap.set(newsTitleRef.current, {
        y: 15
      })

      // ニュースタイトルのアニメーション
      const newsTl = gsap.timeline({
        scrollTrigger: {
          trigger: newsSectionRef.current,
          start: 'top bottom-=200',
          end: 'bottom top+=100',
          toggleActions: 'play none none reverse'
        }
      })

      // h2タイトル（opacity + 下から移動）
      if (newsTitleRef.current) {
        newsTl.to(newsTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.05) // ディレイを短縮
      }

      // ニュースリスト（opacityのみ）
      if (newsListRef.current) {
        newsTl.to(newsListRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4') // 重複時間を短縮
      }

      // moreボタン（opacityのみ）
      if (newsMoreButtonRef.current) {
        newsTl.to(newsMoreButtonRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.3') // 重複時間を短縮
      }
    }

    // メニューセクションのアニメーション
    if (menuSectionRef.current && menuTitleRef.current && menuWrapperRef.current) {
      // 初期状態を設定
      gsap.set([menuTitleRef.current, menuWrapperRef.current], {
        opacity: 0
      })
      gsap.set(menuTitleRef.current, {
        y: 15
      })

      // メニュータイトルのアニメーション
      const menuTl = gsap.timeline({
        scrollTrigger: {
          trigger: menuSectionRef.current,
          start: 'top bottom-=200',
          end: 'bottom top+=100',
          toggleActions: 'play none none reverse'
        }
      })

      // h2タイトル（opacity + 下から移動）
      if (menuTitleRef.current) {
        menuTl.to(menuTitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.05) // ディレイを短縮
      }

      // メニューラッパー（opacityのみ）
      if (menuWrapperRef.current) {
        menuTl.to(menuWrapperRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4') // 重複時間を短縮
      }
    }

    if (heroParallaxAnimation?.scrollTrigger) {
      scrollTriggers.push(heroParallaxAnimation.scrollTrigger)
    }
    if (contentAnimation?.scrollTrigger) {
      scrollTriggers.push(contentAnimation.scrollTrigger)
    }

    // ページ遷移やリロード時にもkillAll
    const handleUnload = () => {
      ScrollTrigger.killAll()
    }
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('popstate', handleUnload)

    // クリーンアップ
    return () => {
      // Lenisインスタンスを破棄
      if (lenis) {
        lenis.destroy()
      }
      
      // まず全てのScrollTriggerをkill
      ScrollTrigger.killAll()
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('popstate', handleUnload)
      // 個別に管理したScrollTriggerを安全にクリーンアップ
      scrollTriggers.forEach((trigger) => {
        if (trigger && trigger.kill) {
          try {
            if (!trigger.pin || trigger.pin.parentNode) {
              trigger.kill()
            }
          } catch (error) {
            console.warn('ScrollTrigger cleanup error:', error)
          }
        }
      })
      if (heroParallaxAnimation) {
        try {
          heroParallaxAnimation.kill()
        } catch (error) {
          console.warn('Hero parallax animation cleanup error:', error)
        }
      }
      if (contentAnimation) {
        try {
          contentAnimation.kill()
        } catch (error) {
          console.warn('Content animation cleanup error:', error)
        }
      }
    }
      }, 100) // 100ms待ってからGSAPを初期化

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {currentPage === 'home' && (
        <div className={styles['main-visual']}> 
            <div className={styles['main-visual-inner']}>
              <div className={styles['main-image-wrapper']}>
                <Image
                  src="/images/hero-photo.png"
                  alt="Salon main visual"
                  width={1360}
                  height={1360}
                  priority={true}
                  className={styles['main-image']}
                  sizes="100vw"
                  quality={90}
                />
              </div>
            </div>
            <div className={styles['main-visual-text']} ref={mainVisualTextRef}>
              <span className={styles['standard']}>A New You,</span>
              <span className={styles['italic']}>Every Day</span>
            </div>
            <div className={styles['border-line']}></div>
          </div>
      )}

      <div className={styles['content-wrapper']}>
        {currentPage === 'home' && (
          <>
            <section ref={conceptSectionRef} className={styles['content-section']}>
              <Container>
                <SectionTitle ref={conceptTitleRef} tag="h2">concept</SectionTitle>
                <h3 ref={conceptCatchphraseRef} className={styles['concept-catchphrase']}>
                  髪の美しさが、あなたの毎日を
                  <br />
                  もっと特別に。
                </h3>
                <p ref={conceptTextRef} className={styles['concept-text']}>
                  <span>一人ひとりの髪質やライフスタイルに寄り添い、ダメージを抑えた施術と心地よい空間で、理想のヘアスタイルをご提案します。</span>
                  <span>髪にやさしいケアと、少しの変化で生まれる新しい自分。</span>
                  <span>毎日がもっと自信に満ちて、笑顔で過ごせるよう、私たちがサポートいたします。</span>
                </p>
              </Container>
              <div className={styles['carousel-container']}>
                <div className={styles['store-carousel']}>
                  <div className={styles['carousel-group']}>
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-01.png"
                        alt="Store view 1"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-02.png"
                        alt="Store view 2"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-04.png"
                        alt="Store view 4"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                  </div>
                  <div className={styles['carousel-group']} aria-hidden="true">
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-01.png"
                        alt="Store view 1"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-02.png"
                        alt="Store view 2"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                    <div className={styles['store-image-wrapper']}>
                      <Image
                        src="/images/store-image-04.png"
                        alt="Store view 4"
                        width={592}
                        height={395}
                        className={styles['store-image']}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section ref={newsSectionRef} className={styles['content-section']}>
              <Container>
                <SectionTitle ref={newsTitleRef} tag="h2">news</SectionTitle>
                <NewsList
                  ref={newsListRef}
                  items={newsItems}
                  maxItems={2}
                  showMoreButton={true}
                  showViewAllButton={true}
                  moreButtonRef={newsMoreButtonRef}
                  onItemClick={(item) => {
                    const isMobile = window.innerWidth < 768
                    if (isMobile) {
                      router.push(`/news/${item.id}`)
                    } else {
                      setCurrentArticleId(item.id)
                      setCurrentPage('news')
                    }
                  }}
                />
              </Container>
            </section>

            <section ref={menuSectionRef} className={styles['content-section']}>
              <Container>
                <SectionTitle ref={menuTitleRef} tag="h2">menu</SectionTitle>
                <div ref={menuWrapperRef} className={styles['menu-wrapper']}>
                  {menuCategories.map((cat) => (
                    <div key={cat.category} className={styles['menu-category']}>
                      <h3 className={styles['menu-subtitle']}>{cat.category}</h3>
                      <ul className={styles['menu-list']}>
                        {cat.items.map((item) => (
                          <li key={item.name} className={styles['menu-item']}>
                            <span>{item.name}</span>
                            <span>{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className={styles['menu-button-wrapper']}>
                  <Link href="/reserve">
                    <Button variant="secondary">reserve</Button>
                  </Link>
                </div>
              </Container>
            </section>
          </>
        )}

        {currentPage === 'news' && !currentArticleId && (
          <NewsListPage />
        )}

        {currentPage === 'news' && currentArticleId && (
          <NewsDetail 
            id={currentArticleId} 
            onArticleChange={(newId) => {
              setCurrentArticleId(newId)
            }}
          />
        )}

        {currentPage === 'reserve' && (
          <ReservePage />
        )}

        {currentPage === 'staff' && (
          <StaffPage />
        )}
      </div>
    </>
  )
}

// メインのHomeコンポーネント（Suspenseでラップ）
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
