'use client'

import { useEffect } from 'react'
import { gsap, ScrollSmoother } from '@/lib/gsap'
import styles from './PhotoParallax.module.css'

interface PhotoParallaxProps {
  photos: {
    src: string
    alt: string
    speed: string
  }[]
}

export default function PhotoParallax({ photos }: PhotoParallaxProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 写真要素のskewY設定
      const skewSetter = gsap.quickTo(`.${styles['photo-item']}`, 'skewY')
      const clamp = gsap.utils.clamp(-10, 10) // 最大角度を10度に制限
      let stopTimer: number | null = null

      // ScrollSmootherの設定
      const smoother = ScrollSmoother.create({
        wrapper: 'body',
        content: 'body',
        smooth: 1, // 滑らかさの設定
        effects: true,
        normalizeScroll: false, // 余白対策
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

      // data-speed属性が自動的に適用される

      // クリーンアップ
      return () => {
        // ScrollSmootherインスタンスを破棄
        if (smoother) {
          smoother.kill()
        }

        // タイマーをクリア
        if (stopTimer) {
          clearTimeout(stopTimer)
        }
      }
    }, 100) // 100ms待ってからGSAPを初期化

    return () => {
      clearTimeout(timer)
    }
  }, [])

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
