'use client'

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './WordCarousel.module.css'

interface WordCarouselProps {
  words: string[]
  interval?: number
  className?: string
  initialDelay?: number // 初期遅延を追加
}

const WordCarousel = ({
  words,
  interval = 3000,
  className = '',
  initialDelay = 0,
}: WordCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isStarted, setIsStarted] = useState(false) // 開始フラグを追加
  const currentWordRef = useRef<HTMLSpanElement>(null)
  const nextWordRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (words.length <= 1) return

    // 初期遅延後に開始
    const startTimer = setTimeout(() => {
      setIsStarted(true)
    }, initialDelay)

    return () => clearTimeout(startTimer)
  }, [words.length, initialDelay])

  useEffect(() => {
    if (words.length <= 1 || !isStarted) return

    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [words.length, interval, isAnimating, isStarted, currentIndex])

  // 初期化時に次の文字を正しく設定
  useEffect(() => {
    if (nextWordRef.current) {
      gsap.set(nextWordRef.current, {
        y: 50,
        opacity: 0,
      })
    }
  }, [])

  useEffect(() => {
    if (!currentWordRef.current || !nextWordRef.current || !isAnimating) return

    const nextIndex = (currentIndex + 1) % words.length

    // 次の文字を下に配置（初期状態）
    gsap.set(nextWordRef.current, {
      y: 50,
      opacity: 1,
    })

    // 同時アニメーション：現在の文字が上に消え、次の文字が下から現れる
    const tl = gsap.timeline({
      onComplete: () => {
        // アニメーション完了後、状態をリセット
        setIsAnimating(false)
        // 次の文字を現在の文字として設定（残像を防ぐため即座に実行）
        setCurrentIndex(nextIndex)
        // 要素の位置をリセット（少し遅延させて確実に実行）
        setTimeout(() => {
          if (currentWordRef.current && nextWordRef.current) {
            gsap.set(currentWordRef.current, {
              y: 0,
            })
            gsap.set(nextWordRef.current, {
              y: 50,
              opacity: 0,
            })
          }
        }, 10)
      },
    })

    tl.to(
      currentWordRef.current,
      {
        y: -50,
        duration: 0.5,
        ease: 'power1.out',
      },
      0
    ).to(
      nextWordRef.current,
      {
        y: 0,
        duration: 0.5,
        ease: 'power1.out',
      },
      0
    )
  }, [isAnimating, currentIndex, words.length])

  const nextIndex = (currentIndex + 1) % words.length

  const renderWord = (word: string) => {
    // 文字列を分割して後半部分にspanを追加
    if (word === 'Offers Care') {
      return (
        <>
          Offers{' '}
          <span className={styles['accent-word']} style={{ fontFamily: 'var(--font-playfair)' }}>
            Care
          </span>
        </>
      )
    } else if (word === 'Gives Smile') {
      return (
        <>
          Gives{' '}
          <span className={styles['accent-word']} style={{ fontFamily: 'var(--font-playfair)' }}>
            Smile
          </span>
        </>
      )
    } else if (word === 'Meets You') {
      return (
        <>
          Meets{' '}
          <span className={styles['accent-word']} style={{ fontFamily: 'var(--font-playfair)' }}>
            You
          </span>
        </>
      )
    } else if (word === 'Brings Beauty') {
      return (
        <>
          Brings{' '}
          <span className={styles['accent-word']} style={{ fontFamily: 'var(--font-playfair)' }}>
            Beauty
          </span>
        </>
      )
    }
    return word
  }

  return (
    <div className={styles.container}>
      <span ref={currentWordRef} className={`${styles.word} ${styles.current} ${className}`}>
        {renderWord(words[currentIndex])}
      </span>
      <span ref={nextWordRef} className={`${styles.word} ${styles.next} ${className}`}>
        {renderWord(words[nextIndex])}
      </span>
    </div>
  )
}

export default WordCarousel
