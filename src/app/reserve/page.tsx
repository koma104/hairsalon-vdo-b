'use client'

import React, { useState } from 'react'
import styles from './reserve.module.css'
import Calendar from '@/components/Calendar/Calendar'
import TimeSelector from '@/components/TimeSelector/TimeSelector'
import Button from '@/components/Button/Button'
import SectionTitle from '@/components/SectionTitle/SectionTitle'
import Container from '@/components/Container/Container'
import Select from '@/components/Select/Select'

const ReservePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('10:30 AM')
  const [selectedService, setSelectedService] = useState('')
  const [selectedStylist, setSelectedStylist] = useState('')

  return (
    <Container>
      <SectionTitle>reserve</SectionTitle>

      <section>
        <div className={styles['reserve-wrapper']}>
          <h2 className={styles['reserve-subtitle']}>date</h2>
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>
        <div className={styles['reserve-wrapper']}>
          <h2 className={styles['reserve-subtitle']}>time</h2>
          <TimeSelector selectedTime={selectedTime} onTimeSelect={setSelectedTime} />
        </div>
        <div className={styles['form-group']}>
          <h2 id="service-label" className={styles['reserve-subtitle']}>
            Service
          </h2>
          <div className={styles['select-wrapper']}>
            <Select
              options={[
                { value: 'cut', label: 'Cut' },
                { value: 'color', label: 'Color' },
                { value: 'treatment', label: 'Treatment' }
              ]}
              value={selectedService}
              onChange={setSelectedService}
              placeholder="選択"
              id="service-select"
              name="service"
            />
          </div>
        </div>
        <div className={styles['form-group']}>
          <h2 id="stylist-label" className={styles['reserve-subtitle']}>
            Stylist
          </h2>
          <div className={styles['select-wrapper']}>
            <Select
              options={[
                { value: 'tanaka', label: 'Akari Tanaka' },
                { value: 'yamamoto', label: 'Sakura Yamamoto' },
                { value: 'nakamura', label: 'Kenji Nakamura' }
              ]}
              value={selectedStylist}
              onChange={setSelectedStylist}
              placeholder="選択"
              id="stylist-select"
              name="stylist"
            />
          </div>
        </div>
      </section>

      <div className={styles['reserve-button-wrapper']}>
        <Button variant="primary">予約確認へ</Button>
      </div>
    </Container>
  )
}

export default ReservePage
