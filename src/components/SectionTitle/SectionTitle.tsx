import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  children: React.ReactNode
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const SectionTitle = forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ children, tag: Tag = 'h1' }, ref) => {
    const internalRef = useRef<HTMLHeadingElement>(null)

    // 外部refに内部refを転送
    useImperativeHandle(ref, () => internalRef.current!, [])

    useEffect(() => {
      const element = internalRef.current
      if (!element) return

      // spanを取得
      const span = element.querySelector('span')
      if (!span) return

      // 初期状態: spanを下に隠す（main-titleと同じ）
      gsap.set(span, {
        y: '100%',
      })

      // ScrollTriggerでアニメーション実行
      const scrollTrigger = ScrollTrigger.create({
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(span, {
            y: '0%',
            duration: 0.8,
            ease: 'power3.out',
          })
        },
        onLeaveBack: () => {
          gsap.to(span, {
            y: '100%',
            duration: 0.6,
            ease: 'power3.in',
          })
        },
      })

      // クリーンアップ
      return () => {
        if (scrollTrigger) {
          scrollTrigger.kill()
        }
      }
    }, [])

    return (
      <Tag ref={internalRef} className={styles['section-title']}>
        <span>{children}</span>
      </Tag>
    )
  }
)

SectionTitle.displayName = 'SectionTitle'

export default SectionTitle
