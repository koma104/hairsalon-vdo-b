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
    // クリップパスアニメーション用のIntersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const staffCard = entry.target as HTMLDivElement
            const image = staffCard.querySelector(`.${styles['staff-image']}`) as HTMLImageElement
            const nameElement = staffCard.querySelector(`.${styles['staff-name']}`) as HTMLElement
            const titleElement = staffCard.querySelector(`.${styles['staff-title']}`) as HTMLElement
            const specialtyElement = staffCard.querySelector(`.${styles['staff-specialty']}`) as HTMLElement
            
            // 画像アニメーション（最初に開始）
            if (image) {
              image.classList.add(styles.animate)
            }

            // テキストアニメーション（画像の後に少し遅れて開始）
            if (nameElement) {
              setTimeout(() => {
                nameElement.classList.add(styles.animate)
              }, 200)
            }

            if (titleElement) {
              setTimeout(() => {
                titleElement.classList.add(styles.animate)
              }, 300)
            }

            if (specialtyElement) {
              setTimeout(() => {
                specialtyElement.classList.add(styles.animate)
              }, 400)
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
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
      <SectionTitle>Staff</SectionTitle>
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
