'use client'

import React, { useState } from 'react'
import styles from './TimeSelector.module.css'

interface TimeSelectorProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
}

const timeSlots = {
  AM: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  PM: [
    '12:00 PM',
    '12:30 PM',
    '13:00 PM',
    '13:30 PM',
    '14:00 PM',
    '17:00 PM',
    '18:00 PM',
    '19:00 PM',
  ],
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, onTimeSelect }) => {
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM')

  return (
    <div className={styles['time-selector']}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'AM' ? styles.active : ''}`}
          onClick={() => setActiveTab('AM')}
        >
          AM
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'PM' ? styles.active : ''}`}
          onClick={() => setActiveTab('PM')}
        >
          PM
        </button>
      </div>
      <div className={styles['time-grid']}>
        {timeSlots[activeTab].map((time) => (
          <button
            key={time}
            className={`${styles['time-slot']} ${selectedTime === time ? styles.selected : ''}`}
            onClick={() => onTimeSelect(time)}
          >
            {time.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSelector
