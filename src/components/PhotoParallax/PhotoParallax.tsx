'use client'

import { useEffect } from 'react'
import { gsap, ScrollSmoother, ScrollTrigger } from '@/lib/gsap'
import styles from './PhotoParallax.module.css'

interface PhotoParallaxProps {
  photos: {
    src: string
    alt: string
    speed: string
    speedPc?: string
  }[]
}

export default function PhotoParallax({ photos }: PhotoParallaxProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // デバイス判定
      const isPC = window.innerWidth >= 768

      // bodyのスクロールを確実に有効化
      if (document.body) {
        document.body.style.overflow = 'auto'
        document.body.style.height = 'auto'
      }

      // 各写真要素を取得
      const photoItems = document.querySelectorAll(`.${styles['photo-item']}`)

      // 写真要素のskewY設定
      const skewSetter = gsap.quickTo(`.${styles['photo-item']}`, 'skewY')
      const clamp = gsap.utils.clamp(-10, 10)

      if (isPC) {
        // PC: ScrollTriggerベースの実装（安全で確実なスクロール）

        photoItems.forEach((item, index) => {
          const element = item as HTMLElement
          const photo = photos[index]
          if (!photo) return

          const speed = photo.speedPc ? parseFloat(photo.speedPc) : parseFloat(photo.speed)
          // PCでは移動距離を大幅に増加（200 -> 300）
          const yMovement = (1 - speed) * 300

          gsap.fromTo(
            element,
            { y: -yMovement },
            {
              y: yMovement,
              ease: 'none',
              scrollTrigger: {
                trigger: element.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          )
        })

        // PC用の傾き効果（強化版）
        let lastScrollTop = 0
        let animationId: number

        const updateSkew = () => {
          const currentScrollTop = window.pageYOffset
          const scrollVelocity = currentScrollTop - lastScrollTop
          lastScrollTop = currentScrollTop
          // PCでは傾き効果を強化（0.3 -> 0.5）
          skewSetter(clamp(scrollVelocity * 0.5))
          animationId = requestAnimationFrame(updateSkew)
        }

        updateSkew()

        return () => {
          cancelAnimationFrame(animationId)
          ScrollTrigger.killAll()
        }
      } else {
        // SP: ScrollSmootherベースの実装（滑らかな動き）

        let stopTimer: number | null = null
        let smoother: { kill: () => void } | null = null

        // SP用のdata-speed属性設定
        photoItems.forEach((item, index) => {
          const element = item as HTMLElement
          const photo = photos[index]
          if (!photo) return
          element.setAttribute('data-speed', photo.speed)
        })

        setTimeout(() => {
          try {
            smoother = ScrollSmoother.create({
              wrapper: 'body',
              content: 'body',
              smooth: 1,
              effects: true,
              normalizeScroll: false,
              smoothTouch: false,
              ignoreMobileResize: true,
              onUpdate: (self) => {
                if (stopTimer) {
                  clearTimeout(stopTimer)
                  stopTimer = null
                }
                skewSetter(clamp(self.getVelocity() / -80))
              },
              onStop: () => {
                stopTimer = window.setTimeout(() => {
                  skewSetter(0)
                }, 100)
              },
            })
          } catch (error) {
            console.error('ScrollSmoother initialization failed:', error)
            if (document.body) {
              document.body.style.overflow = 'auto'
            }
          }
        }, 50)

        return () => {
          if (smoother) {
            try {
              smoother.kill()
            } catch (error) {
              console.warn('ScrollSmoother cleanup failed:', error)
            }
          }
          if (stopTimer) {
            clearTimeout(stopTimer)
          }
          if (document.body) {
            document.body.style.overflow = 'auto'
          }
        }
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      // ScrollSmootherのクリーンアップ（getAll()は使用しない）
      if (document.body) {
        document.body.style.overflow = 'auto'
        document.body.style.height = 'auto'
      }
    }
  }, [photos])

  return (
    <section className={styles['photo-parallax-container']}>
      <div className={styles['photo-wrapper']}>
        {photos.map((photo, index) => (
          <div
            key={index}
            className={styles['photo-item']}
            data-speed={photo.speed}
            style={{ backgroundImage: `url(${photo.src})` }}
          ></div>
        ))}
      </div>
    </section>
  )
}
