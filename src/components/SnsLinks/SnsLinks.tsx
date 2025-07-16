import React from 'react'
import styles from './SnsLinks.module.css'
import YouTubeIcon from '../icons/YouTubeIcon'
import InstagramIcon from '../icons/InstagramIcon'
import XIcon from '../icons/XIcon'

const snsLinks = [
  {
    href: 'https://youtube.com',
    alt: 'YouTube',
    icon: <span className={styles['youtube-fix']}><YouTubeIcon size={26} /></span>,
  },
  {
    href: 'https://instagram.com',
    alt: 'Instagram',
    icon: <InstagramIcon size={22} />,
  },
  {
    href: 'https://x.com',
    alt: 'X',
    icon: <XIcon size={18} />,
  },
]

const SnsLinks = () => {
  return (
    <div className={styles['sns-links']}>
      {snsLinks.map((link) => (
        <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.alt}>
          {link.icon}
        </a>
      ))}
    </div>
  )
}

export default SnsLinks 