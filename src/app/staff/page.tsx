'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import styles from './staff.module.css'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import Container from '@/components/Container/Container'

const staffMembers = [
  {
    name: 'akari tanaka',
    title: 'senior stylist',
    specialty: 'specializes in color and highlights',
    imageUrl: '/images/staff-image-01.png',
  },
  {
    name: 'sakura yamamoto',
    title: 'stylist',
    specialty: 'expert in cutting and styling',
    imageUrl: '/images/staff-image-02.png',
  },
  {
    name: 'kenji nakamura',
    title: 'barber',
    specialty: "specializes in men's grooming",
    imageUrl: '/images/staff-image-03.png',
  },
  {
    name: 'yuki sato',
    title: 'junior stylist',
    specialty: 'focuses on modern cuts and treatments',
    imageUrl: '/images/staff-image-04.png',
  },
]

const StaffPage = () => {
  const staffRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const scheduleTextAfterImage = (
      nameElement: HTMLElement | null,
      titleElement: HTMLElement | null,
      specialtyElement: HTMLElement | null
    ) => {
      if (nameElement) {
        setTimeout(() => nameElement.classList.add(styles.animate), 800)
      }
      if (titleElement) {
        setTimeout(() => titleElement.classList.add(styles.animate), 900)
      }
      if (specialtyElement) {
        setTimeout(() => specialtyElement.classList.add(styles.animate), 1000)
      }
    }

    /** 画像のレイアウト／デコード後に 1 フレーム空けてから clip-path の transition を掛ける */
    const revealImageThenText = (
      image: HTMLImageElement,
      nameElement: HTMLElement | null,
      titleElement: HTMLElement | null,
      specialtyElement: HTMLElement | null
    ) => {
      const apply = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            image.classList.add(styles.animate)
            scheduleTextAfterImage(nameElement, titleElement, specialtyElement)
          })
        })
      }
      if (image.complete && image.naturalHeight > 0) {
        apply()
      } else {
        image.addEventListener('load', apply, { once: true })
        image.addEventListener('error', apply, { once: true })
      }
    }

    // クリップパスアニメーション用のIntersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const staffCard = entry.target as HTMLDivElement
            const image =
              (staffCard.querySelector(`img.${styles['staff-image']}`) as HTMLImageElement | null) ??
              (staffCard.querySelector('img') as HTMLImageElement | null)
            const nameElement = staffCard.querySelector(`.${styles['staff-name']}`) as HTMLElement
            const titleElement = staffCard.querySelector(`.${styles['staff-title']}`) as HTMLElement
            const specialtyElement = staffCard.querySelector(
              `.${styles['staff-specialty']}`
            ) as HTMLElement

            if (image) {
              revealImageThenText(image, nameElement, titleElement, specialtyElement)
            } else {
              scheduleTextAfterImage(nameElement, titleElement, specialtyElement)
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    staffRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Container>
      <div className={styles['section-title-wrapper']}>
        <SectionTitle disableAnimation={true}>Staff</SectionTitle>
      </div>
      <div className={styles['staff-list']}>
        {staffMembers.map((staff, index) => (
          <div
            key={index}
            className={styles['staff-card']}
            ref={(el) => {
              staffRefs.current[index] = el
            }}
          >
            <div className={styles['image-wrapper']}>
              <Image
                src={staff.imageUrl}
                alt={staff.name}
                width={160}
                height={213}
                className={styles['staff-image']}
                priority={index === 0}
                sizes="(max-width: 767px) 8rem, 12rem"
              />
            </div>
            <div className={styles['staff-info']}>
              <h2 className={styles['staff-name']}>{staff.name}</h2>
              <p className={styles['staff-title']}>{staff.title}</p>
              <p className={styles['staff-specialty']}>{staff.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default StaffPage
