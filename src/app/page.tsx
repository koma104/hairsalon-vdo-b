'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './page.module.css'
import { newsItems } from '@/lib/newsData'
import Button from '@/components/Button/Button'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import PhotoParallax from '@/components/PhotoParallax/PhotoParallax'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
import NewsListPage from './news/page'
import NewsDetail from '@/components/NewsDetail/NewsDetail'
import ReservePage from './reserve/page'
import StaffPage from './staff/page'
import NewsList from '@/components/NewsList/NewsList'
import Container from '@/components/Container/Container'
import WordCarousel from '@/components/WordCarousel/WordCarousel'
import { usePageContext } from '@/contexts/PageContext'

// ヒーロー画像の配列
const heroImages = [
  '/images/hero-photo-01.png',
  '/images/hero-photo-02.png',
  '/images/hero-photo-03.png',
  '/images/hero-photo-04.png',
]

// タイプライターアニメーション用のテキスト
const typewriterText = [
  'In the heart of the city, where style',
  'meets sophistication, we create more',
  'than just haircuts - we craft experiences',
  'that reveal your true character.',
]

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { currentPage, setCurrentPage } = usePageContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() // 追加

  // アニメーション用のref
  const conceptSectionRef = useRef<HTMLElement>(null)
  const conceptCatchphraseRef = useRef<HTMLHeadingElement>(null)
  const conceptTextRef = useRef<HTMLParagraphElement>(null)

  // ニュースセクション用のref
  const newsSectionRef = useRef<HTMLElement>(null)
  const newsListRef = useRef<HTMLDivElement>(null)
  const newsMoreButtonRef = useRef<HTMLDivElement>(null)
  const newsScrollTriggerRef = useRef<gsap.plugins.ScrollTriggerInstance | null>(null)

  // メニューセクション用のref
  const menuSectionRef = useRef<HTMLElement>(null)
  const menuWrapperRef = useRef<HTMLDivElement>(null)
  const menuAnimationExecutedRef = useRef(false) // メニューアニメーション実行フラグ

  // タイプライターアニメーション用のref
  const typewriterContainerRef = useRef<HTMLDivElement>(null)

  // 現在の画像インデックスを管理するref
  const currentImageIndexRef = useRef(0)

  // 画像切り替えアニメーション
  const switchToNextImage = (heroParallaxAnimationRef: gsap.core.Tween | null) => {
    const nextIndex = (currentImageIndexRef.current + 1) % heroImages.length

    // 現在の画像と次の画像の要素を取得
    const currentImageElement = document.querySelector(
      `.${styles['main-image']}.${styles['current']}`
    ) as HTMLElement
    const nextImageElement = document.querySelector(
      `.${styles['main-image']}:nth-child(${nextIndex + 1})`
    ) as HTMLElement

    if (currentImageElement && nextImageElement) {
      // 現在の画像はスケール変化なし（フェードアウトのみ）
      // 次の画像を1.1から1にスケールダウン（フェードイン）
      gsap.set(nextImageElement, { scale: 1.1 })
      gsap.to(nextImageElement, {
        scale: 1,
        duration: 6,
        ease: 'none',
      })

      // 次の画像を設定（state更新でCSSクラス切り替え）
      currentImageIndexRef.current = nextIndex
      setCurrentImageIndex(nextIndex)

      // パララックス効果は親要素に適用済みなので、画像切り替え時は何もしない
      // （親要素のパララックスは継続される）
    }

    // 6秒後に次の画像に切り替え（常に実行）
    setTimeout(() => switchToNextImage(heroParallaxAnimationRef), 6000)

    return heroParallaxAnimationRef
  }

  // 画像インデックスの変更を監視
  useEffect(() => {}, [currentImageIndex])

  // タイトルとタイプライターアニメーション
  useEffect(() => {
    if (!typewriterContainerRef.current) return

    const initializeAnimations = async () => {
      // フォント読み込み完了を待つ
      await document.fonts.ready

      // タイトル要素を取得
      const titleElement = typewriterContainerRef.current?.querySelector(
        `.${styles['main-title']}`
      ) as HTMLElement
      const titleLines = titleElement?.querySelectorAll(`.${styles['title-line']}`)

      // テキスト要素を取得
      const textElements = typewriterContainerRef.current?.querySelectorAll(
        `.${styles['typewriter-text']}`
      )

      if (!textElements || !typewriterContainerRef.current) return

      // SplitTextで文字分割
      const splitTexts: SplitText[] = []
      textElements.forEach((textElement) => {
        const splitText = new SplitText(textElement, { type: 'chars' })
        splitTexts.push(splitText)

        // 初期状態で全ての文字を非表示にする
        gsap.set(splitText.chars, {
          opacity: 0,
          backgroundColor: 'transparent',
          color: 'white',
        })

        // 文字分割完了後、親要素を表示
        gsap.set(textElement, {
          opacity: 1,
        })
      })

      // タイトルアニメーション（下からスライドイン）
      setTimeout(() => {
        if (titleLines) {
          const allTitleSpans: Element[] = []
          titleLines.forEach((line) => {
            const spans = line.querySelectorAll('span')
            allTitleSpans.push(...Array.from(spans))
          })

          if (allTitleSpans.length > 0) {
            gsap.to(allTitleSpans, {
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
            })
          }
        }
      }, 500) // ページ読み込み後0.5秒で開始

      // タイプライターアニメーション設定
      const speed = 0.02 // 文字表示速度を少し早く

      const animateLine = (lineIndex: number, charIndex: number = 0) => {
        if (lineIndex >= splitTexts.length) return

        const splitText = splitTexts[lineIndex]
        const chars = splitText.chars

        if (charIndex >= chars.length) {
          // この行が終わったら、次の行へ（溜めは前の文字で既に追加済み）
          animateLine(lineIndex + 1, 0)
          return
        }

        const char = chars[charIndex] as HTMLElement

        // 文字の表示時間に微細なランダム性を追加
        const randomDuration = 0.08 + Math.random() * 0.04 // 0.08〜0.12秒のランダム

        gsap
          .fromTo(
            char,
            {
              opacity: 0,
              y: 0,
              backgroundColor: 'black',
              color: 'white',
            },
            {
              opacity: 1,
              y: 0,
              backgroundColor: 'black',
              color: 'white',
              duration: randomDuration,
              ease: 'none',
            }
          )
          .then(() => {
            // 文字が完全に表示されてから背景を透明に
            gsap.to(char, {
              backgroundColor: 'transparent',
              duration: 0.15,
              delay: 0.05,
              ease: 'none',
            })
          })

        // 次の文字へ（行の最後の文字の場合は行間の溜めを追加）
        const randomSpeed = speed + (Math.random() - 0.5) * 0.02 // ±0.01秒のランダム
        const nextDelay = charIndex === chars.length - 1 ? speed * 1000 + 400 : randomSpeed * 1000
        setTimeout(() => {
          animateLine(lineIndex, charIndex + 1)
        }, nextDelay)
      }

      // アニメーション開始（タイトルアニメーションの後にタイプライター開始）
      setTimeout(() => {
        animateLine(0, 0) // 最初の行から開始
      }, 1200) // タイトルアニメーション完了後に開始
    }

    // async関数を実行
    initializeAnimations()
  }, []) // 初回のみ実行されるように変更

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

  // ページ遷移時にbody heightをクリア（フッター余白問題の解決）
  useEffect(() => {
    // ページ遷移時にスクロール位置をトップにリセット
    window.scrollTo(0, 0)

    if (currentPage !== 'home' && document.body) {
      // より強力なbody heightのクリア
      document.body.style.height = ''
      document.body.style.minHeight = ''
      document.body.style.maxHeight = ''
      document.body.removeAttribute('style')

      // 強制的に再計算
      document.body.style.height = 'auto'
      document.body.style.minHeight = 'auto'

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
          smoother.kill()
        }
      })

      // 最終確認
      setTimeout(() => {
        console.log(
          '🔧 Final check - computed height:',
          window.getComputedStyle(document.body).height
        )
        console.log('🔧 Final check - style height:', document.body.style.height)
      }, 100)
    } else {
      console.log('🔍 ホームページまたはbody要素なし')
    }
  }, [pathname, currentPage, currentArticleId])

  // PCでの直接アクセス時の処理は削除（記事詳細ページで処理する）

  useEffect(() => {
    // 初期ビューポート高さを取得してCSS変数に設定（iOS対応）
    const setInitialViewportHeight = () => {
      const vh = window.innerHeight
      document.documentElement.style.setProperty('--initial-vh', `${vh}px`)
    }

    // 初期設定
    setInitialViewportHeight()

    // DOMが完全にマウントされるまで少し待つ
    const timer = setTimeout(() => {
      // デバイス判定
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768

      // ScrollSmootherを無効化（ヘッダー問題解決のため）
      // const skewSetter = gsap.quickTo(`.${styles['photo-item']}`, 'skewY')
      // const clamp = gsap.utils.clamp(-20, 20)
      // let stopTimer: number | null = null

      // const smoother = ScrollSmoother.create({
      //   wrapper: 'body',
      //   content: 'body',
      //   smooth: 1.5,
      //   effects: true,
      //   normalizeScroll: true,
      //   smoothTouch: false,
      //   ignoreMobileResize: true,
      //   onUpdate: (self) => {
      //     // タイマーをクリア
      //     if (stopTimer) {
      //       clearTimeout(stopTimer)
      //       stopTimer = null
      //     }
      //     skewSetter(clamp(self.getVelocity() / -50))
      //   },
      //   onStop: () => {
      //     // 少し遅延してからリセット（より自然な動作）
      //     stopTimer = window.setTimeout(() => {
      //       skewSetter(0)
      //     }, 100)
      //   },
      // })

      // data-speed属性が自動的に適用される

      // ScrollTriggerインスタンスを個別管理
      const scrollTriggers: ScrollTrigger[] = []

      // パララックス効果：ヒーロー画像のアニメーション
      let heroParallaxAnimation: gsap.core.Tween | null = null

      // 要素が存在することを確認してからアニメーションを実行
      const mainVisualElement = document.querySelector(`.${styles['main-visual']}`)
      const contentWrapperElement = document.querySelector(`.${styles['content-wrapper']}`)

      let contentAnimation: gsap.core.Tween | null = null

      if (mainVisualElement) {
        // パララックス効果：親要素（main-image-wrapper）に適用
        const mainImageWrapper = document.querySelector(
          `.${styles['main-image-wrapper']}`
        ) as HTMLElement

        if (mainImageWrapper) {
          heroParallaxAnimation = gsap.to(mainImageWrapper, {
            yPercent: isMobile ? -5 : -10, // スマホでは軽微な効果
            ease: 'none',
            scrollTrigger: {
              trigger: mainVisualElement,
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.5 : 1, // スマホではより滑らかなスクラブ
            },
          })
        }

        // 1枚目の初期スケールアニメーション開始
        const firstImageElement = document.querySelector(
          `.${styles['main-image']}.${styles['current']}`
        ) as HTMLElement
        if (firstImageElement) {
          gsap.to(firstImageElement, {
            scale: 1,
            duration: 6,
            ease: 'none',
          })
        }

        // 6秒後に画像切り替えアニメーション開始
        setTimeout(() => {
          const newParallaxAnimation = switchToNextImage(heroParallaxAnimation)
          if (newParallaxAnimation) {
            heroParallaxAnimation = newParallaxAnimation
          }
        }, 6000)
      }

      // パララックス効果：タイプライターテキストのアニメーション
      const typewriterContainer = document.querySelector(
        `.${styles['typewriter-text-container']}`
      ) as HTMLElement
      if (typewriterContainer) {
        gsap.to(typewriterContainer, {
          yPercent: isMobile ? -15 : -25, // さらに大きな移動距離
          ease: 'none',
          scrollTrigger: {
            trigger: mainVisualElement,
            start: 'top top',
            end: 'bottom top',
            scrub: isMobile ? 0.5 : 1,
          },
        })
      }

      // 写真パララックス効果 - ScrollSmootherのみ使用（ScrollTriggerは削除）
      // data-speed属性が自動的に適用される

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

      // コンセプトキャッチフレーズとテキストのアニメーション
      if (conceptSectionRef.current && conceptCatchphraseRef.current && conceptTextRef.current) {
        // キャッチフレーズのアニメーション
        const catchphraseSplit = new SplitText(conceptCatchphraseRef.current, {
          type: 'lines',
          linesClass: 'catchphrase-line',
          mask: 'lines',
          autoSplit: true,
        })
        const catchphraseLines = [...catchphraseSplit.lines]

        catchphraseLines.forEach((line: Element) => {
          gsap.set(line, {
            yPercent: 100,
            willChange: 'transform',
          })
        })

        // テキストのアニメーション - 動的行分割システムを起動
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            setTimeout(() => {
              const dynamicLines = createDynamicLineSplit()
              if (dynamicLines && dynamicLines.length > 0) {
                setupDynamicAnimation(dynamicLines)
                setupResizeObserver()
              }
            }, 200)
          })
        } else {
          setTimeout(() => {
            const dynamicLines = createDynamicLineSplit()
            if (dynamicLines && dynamicLines.length > 0) {
              setupDynamicAnimation(dynamicLines)
              setupResizeObserver()
            }
          }, 500)
        }

        // キャッチフレーズ用ScrollTrigger
        ScrollTrigger.create({
          trigger: conceptCatchphraseRef.current,
          start: 'top bottom-=230',
          id: 'catchphrase',
          onEnter: () => {
            gsap.to(catchphraseLines, {
              yPercent: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
            })
          },
          onLeaveBack: () => {
            gsap.to(catchphraseLines, {
              yPercent: 100,
              duration: 0.5,
              ease: 'power3.in',
              stagger: 0.1,
            })
          },
        })
      }

      // ニュースセクションのアニメーション
      if (newsSectionRef.current && newsListRef.current && newsMoreButtonRef.current) {
        // ニュースアイテムを取得（NewsListコンポーネント内から）
        const newsItems = newsListRef.current?.querySelectorAll('button[class*="news-item"]')

        // 初期状態を設定（news-itemを下から隠す）
        if (newsItems && newsItems.length > 0) {
          gsap.set(newsItems, {
            y: 50,
            opacity: 0,
          })
        }

        // moreボタンの初期状態
        gsap.set(newsMoreButtonRef.current, {
          opacity: 0,
        })

        // ニュースタイトルのアニメーション
        const newsTl = gsap.timeline({
          scrollTrigger: {
            trigger: newsSectionRef.current,
            start: 'top bottom-=200',
            end: 'bottom top+=100',
            once: true, // 1度だけ実行
          },
        })

        // ScrollTriggerの参照を保存
        if (newsTl.scrollTrigger) {
          newsScrollTriggerRef.current = newsTl.scrollTrigger
        }

        // SectionTitleのアニメーションは削除（コンポーネント内で処理）

        // ニュースアイテムを順番に下から表示
        if (newsItems && newsItems.length > 0) {
          newsItems.forEach((item, index) => {
            newsTl.to(
              item,
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
              },
              0.2 + index * 0.1 // 0.1秒ずつ遅延
            )
          })
        }

        // moreボタン（opacityのみ）
        if (newsMoreButtonRef.current) {
          newsTl.to(
            newsMoreButtonRef.current,
            {
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.3'
          ) // 重複時間を短縮
        }
      }

      // メニューセクションのアニメーション
      if (menuSectionRef.current && menuWrapperRef.current) {
        const initializeMenuAnimations = async () => {
          // 既に実行済みの場合はスキップ
          if (menuAnimationExecutedRef.current) return

          // フォント読み込み完了を待つ
          await document.fonts.ready

          // メニューアイテムの全spanを取得
          const menuItems = menuWrapperRef.current?.querySelectorAll(`.${styles['menu-item']}`)
          const nameSpans: HTMLElement[] = []
          const priceSpans: HTMLElement[] = []

          menuItems?.forEach((item) => {
            const spans = item.querySelectorAll('span')
            if (spans.length >= 2) {
              nameSpans.push(spans[0] as HTMLElement)
              priceSpans.push(spans[1] as HTMLElement)
            }
          })

          // SplitTextで文字分割
          const nameSplitTexts: SplitText[] = []
          const priceSplitTexts: SplitText[] = []

          nameSpans.forEach((span) => {
            const splitText = new SplitText(span, { type: 'chars' })
            nameSplitTexts.push(splitText)
            // 初期状態で全文字を非表示
            gsap.set(splitText.chars, {
              opacity: 0,
              backgroundColor: 'transparent',
              color: 'inherit',
            })
          })

          priceSpans.forEach((span) => {
            const splitText = new SplitText(span, { type: 'chars' })
            priceSplitTexts.push(splitText)
            // 初期状態で全文字を非表示
            gsap.set(splitText.chars, {
              opacity: 0,
              backgroundColor: 'transparent',
              color: 'inherit',
            })
          })

          // 初期状態を設定（SectionTitleは除外 - 独自アニメーションがあるため）
          gsap.set(menuWrapperRef.current, {
            opacity: 0,
          })

          // メニュータイトルのアニメーション（1度だけ実行）
          const menuTl = gsap.timeline({
            scrollTrigger: {
              trigger: menuSectionRef.current,
              start: 'top bottom-=200',
              end: 'bottom top+=100',
              once: true, // 1回だけ実行
            },
          })

          // SectionTitleのアニメーションは削除（コンポーネント内で処理）

          // メニューラッパー（opacityのみ）
          if (menuWrapperRef.current) {
            menuTl.to(
              menuWrapperRef.current,
              {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
              },
              0.2
            )
          }

          // タイプライター効果の実行関数
          const animateMenuTypewriter = () => {
            // 1. 全行のメニュー名を同時にタイプライター開始
            nameSplitTexts.forEach((splitText) => {
              const chars = splitText.chars as HTMLElement[]
              chars.forEach((char, charIndex) => {
                const delay = charIndex * 0.03 // 各行内で30msずつ遅延
                gsap.to(char, {
                  opacity: 1,
                  backgroundColor: '#000',
                  color: '#fff',
                  duration: 0.1,
                  delay: delay,
                  ease: 'none',
                  onComplete: () => {
                    // 文字表示後に背景を透明にして文字色を元に戻す
                    gsap.to(char, {
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      duration: 0.1,
                      delay: 0.05,
                    })
                  },
                })
              })
            })

            // 2. メニュー名完了後に価格を全行同時にタイプライター開始
            const maxNameDuration = Math.max(...nameSplitTexts.map((st) => st.chars.length)) * 0.03
            const priceStartDelay = maxNameDuration + 0.3 // 最長のメニュー名完了後300ms待機

            priceSplitTexts.forEach((splitText) => {
              const chars = splitText.chars as HTMLElement[]
              chars.forEach((char, charIndex) => {
                const delay = priceStartDelay + charIndex * 0.025 // 各行内で25msずつ遅延
                gsap.to(char, {
                  opacity: 1,
                  backgroundColor: '#000',
                  color: '#fff',
                  duration: 0.08,
                  delay: delay,
                  ease: 'none',
                  onComplete: () => {
                    // 文字表示後に背景を透明にして文字色を元に戻す
                    gsap.to(char, {
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      duration: 0.1,
                      delay: 0.05,
                    })
                  },
                })
              })
            })
          }

          // メニューラッパー表示後にタイプライター開始
          menuTl.call(animateMenuTypewriter, [], 0.3)

          // アニメーション実行フラグを設定
          menuAnimationExecutedRef.current = true
        }

        // async関数を実行
        initializeMenuAnimations()
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
        // ScrollSmootherを無効化したためコメントアウト
        // if (smoother) {
        //   smoother.kill()
        // }

        // if (stopTimer) {
        //   clearTimeout(stopTimer)
        // }

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

  // 動的行分割システム（PC/SPで切り替え）
  const createDynamicLineSplit = (): NodeListOf<Element> | null => {
    if (!conceptTextRef.current) return null

    const text = conceptTextRef.current.textContent || ''
    const element = conceptTextRef.current
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    // 元のテキストに戻す
    element.innerHTML = text

    let lines: string[] = []

    if (isMobile) {
      // SP: 自然な改行（元のロジック）
      const chars = text.split('')
      element.innerHTML = chars
        .map(
          (char, index) =>
            `<span data-char-index="${index}">${char === ' ' ? '&nbsp;' : char}</span>`
        )
        .join('')

      // 各文字の位置を取得して行を検出
      const charSpans = element.querySelectorAll('[data-char-index]')
      let currentLine = ''
      let currentTop = -1

      charSpans.forEach((span, index) => {
        const spanElement = span as HTMLElement
        const rect = spanElement.getBoundingClientRect()

        // 新しい行の開始を検出（Y座標が変わった時）
        if (currentTop === -1) {
          currentTop = Math.round(rect.top)
        } else if (Math.round(rect.top) !== currentTop) {
          // 新しい行に移った
          if (currentLine.trim()) {
            lines.push(currentLine.trim())
          }
          currentLine = ''
          currentTop = Math.round(rect.top)
        }

        currentLine += chars[index]
      })

      // 最後の行を追加
      if (currentLine.trim()) {
        lines.push(currentLine.trim())
      }
    } else {
      // PC: 句点（。）で改行
      lines = text
        .split('。')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
      // 全ての行に句点を復元
      lines = lines.map((line) => {
        return line + '。'
      })
    }

    // 検出した行でHTMLを再構築
    element.innerHTML = lines
      .map((line, index) => `<div class="dynamic-line" data-line="${index}">${line}</div>`)
      .join('')

    return element.querySelectorAll('.dynamic-line')
  }

  // ResizeObserver でリサイズ監視
  const setupResizeObserver = () => {
    if (!conceptTextRef.current) return

    let resizeTimeout: NodeJS.Timeout

    const resizeObserver = new ResizeObserver(() => {
      // デバウンス処理（リサイズ完了後に実行）
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // ScrollTriggerを一時無効化
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars?.id === 'dynamic-text') {
            trigger.kill()
          }
        })

        // 動的行分割を再実行
        const dynamicLines = createDynamicLineSplit()
        if (dynamicLines) {
          setupDynamicAnimation(dynamicLines)
        }
      }, 300) // 300ms後に実行
    })

    resizeObserver.observe(conceptTextRef.current)

    // クリーンアップ関数を返す
    return () => resizeObserver.disconnect()
  }

  // 動的行アニメーション設定
  const setupDynamicAnimation = (lines: NodeListOf<Element>) => {
    if (!lines.length || !conceptTextRef.current) return

    // 親要素の設定をマスクベースに最適化
    gsap.set(conceptTextRef.current, {
      position: 'relative',
    })

    // 各行の詳細確認とマスクベース初期設定
    lines.forEach((line) => {
      const lineElement = line as HTMLElement

      // 各行を個別にラップしてoverflow: hiddenでマスク
      const lineWrapper = document.createElement('div')
      lineWrapper.style.overflow = 'hidden'
      lineWrapper.style.position = 'relative'

      // 元の行をラッパーで包む
      const parent = lineElement.parentNode
      if (parent) {
        parent.insertBefore(lineWrapper, lineElement)
        lineWrapper.appendChild(lineElement)
      }

      // 各行を行の高さ分だけ下に移動
      gsap.set(lineElement, {
        yPercent: 100,
        willChange: 'transform',
        force3D: true,
        immediateRender: true,
      })
    })

    // ScrollTrigger設定
    ScrollTrigger.create({
      trigger: conceptTextRef.current,
      start: 'top bottom-=250',
      id: 'dynamic-text',
      onEnter: () => {
        gsap.to(lines, {
          yPercent: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          force3D: true,
        })
      },
      onLeaveBack: () => {
        gsap.to(lines, {
          yPercent: 100,
          duration: 0.5,
          ease: 'power3.in',
          stagger: 0.1,
          force3D: true,
        })
      },
    })
  }

  return (
    <>
      {currentPage === 'home' && (
        <div className={styles['main-visual']}>
          <div className={styles['main-visual-inner']}>
            <div className={styles['main-image-wrapper']}>
              {/* 4つの画像を重ねて配置 */}
              {heroImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt="Salon main visual"
                  width={1360}
                  height={1360}
                  priority={index === 0}
                  className={`${styles['main-image']} ${
                    index === currentImageIndex ? styles['current'] : styles['hidden']
                  } ${index === 2 ? styles['image-offset-right'] : ''}`}
                  sizes="100vw"
                  quality={90}
                />
              ))}
            </div>
            <div ref={typewriterContainerRef} className={styles['typewriter-text-container']}>
              <h2 className={styles['main-title']}>
                <div className={styles['title-line']}>
                  <span>Where Style</span>
                </div>
                <div className={styles['title-line']}>
                  <WordCarousel
                    words={['Meets You', 'Brings Beauty', 'Makes Dreams', 'Gives Love']}
                    interval={6000}
                    initialDelay={1000}
                  />
                </div>
              </h2>
              {typewriterText.map((text, index) => (
                <p key={index} className={styles['typewriter-text']}>
                  {text}
                </p>
              ))}
            </div>
            {/* Reserve Button */}
            <div className={styles['main-visual-reserve-button']}>
              <Link
                href="/reserve"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage('reserve')
                }}
              >
                <Button variant="secondary">reserve</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className={styles['content-wrapper']}>
        {currentPage === 'home' && (
          <>
            <section ref={conceptSectionRef} className={styles['content-section']}>
              <Container>
                <div className={styles['section-title-wrapper']}>
                  <SectionTitle tag="h2">concept</SectionTitle>
                </div>
                <h3 ref={conceptCatchphraseRef} className={styles['concept-catchphrase']}>
                  髪の美しさが、あなたの毎日を
                  <br />
                  もっと特別に。
                </h3>
                <p ref={conceptTextRef} className={styles['concept-text']}>
                  一人ひとりの髪質やライフスタイルに寄り添い、ダメージを抑えた施術で理想のヘアスタイルをご提案します。髪にやさしいケアと、少しの変化で生まれる新しい自分。毎日がもっと自信に満ちて、笑顔で過ごせるよう、私たちがサポートいたします。
                </p>
              </Container>
            </section>

            <PhotoParallax
              photos={[
                {
                  src: '/images/prx-image-01.jpg',
                  alt: 'Photo 1',
                  speed: '1.1',
                  speedPc: '1.3',
                },
                {
                  src: '/images/prx-image-02.jpg',
                  alt: 'Photo 2',
                  speed: '0.8',
                  speedPc: '0.6',
                },
                {
                  src: '/images/prx-image-03.jpg',
                  alt: 'Photo 3',
                  speed: '1.1',
                  speedPc: '1.3',
                },
                {
                  src: '/images/prx-image-04.jpg',
                  alt: 'Photo 4',
                  speed: '0.9',
                  speedPc: '0.7',
                },
                {
                  src: '/images/prx-image-05.jpg',
                  alt: 'Photo 5',
                  speed: '0.9',
                  speedPc: '0.8',
                },
                {
                  src: '/images/prx-image-06.jpg',
                  alt: 'Photo 6',
                  speed: '1.1',
                  speedPc: '1.2',
                },
                {
                  src: '/images/prx-image-07.jpg',
                  alt: 'Photo 7',
                  speed: '0.9',
                  speedPc: '0.9',
                },
              ]}
            />

            <section ref={newsSectionRef} className={styles['content-section']}>
              <Container>
                <div className={styles['section-title-wrapper']}>
                  <SectionTitle tag="h2">news</SectionTitle>
                </div>
                <NewsList
                  ref={newsListRef}
                  items={newsItems}
                  maxItemsSp={4}
                  maxItemsPc={6}
                  showMoreButton={true}
                  showViewAllButton={true}
                  moreButtonRef={newsMoreButtonRef}
                  layout="grid"
                  scrollTriggerRef={newsScrollTriggerRef}
                  onItemClick={(item) => {
                    const isMobile = window.innerWidth < 768
                    setCurrentArticleId(item.id)
                    setCurrentPage('news')
                    if (isMobile) {
                      router.push(`/news/${item.id}`)
                    }
                  }}
                />
              </Container>
            </section>

            <section ref={menuSectionRef} className={styles['content-section']}>
              <Container>
                <div className={styles['section-title-wrapper']}>
                  <SectionTitle tag="h2">menu</SectionTitle>
                </div>
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
                  <Link
                    href="/reserve"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage('reserve')
                    }}
                  >
                    <Button variant="secondary">reserve</Button>
                  </Link>
                </div>
              </Container>
            </section>
          </>
        )}

        {currentPage === 'news' && !currentArticleId && <NewsListPage />}

        {currentPage === 'news' && currentArticleId && (
          <NewsDetail
            id={currentArticleId}
            onArticleChange={(newId) => {
              setCurrentArticleId(newId)
            }}
          />
        )}

        {currentPage === 'reserve' && <ReservePage />}

        {currentPage === 'staff' && <StaffPage />}
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
