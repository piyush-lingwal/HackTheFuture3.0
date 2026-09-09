import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/hero-stack.css'

interface StackImage {
  src: string
  title: string
  subtitle: string
  tag: string
}

const HERO_IMAGES: StackImage[] = [
  {
    src: '/heroImage/htf2.webp',
    title: 'Hack The Future Flashback',
    subtitle: '24-Hour Innovation Marathon at Tulas University',
    tag: 'HTF 2.0',
  },
  {
    src: '/heroImage/acmTeam.webp',
    title: 'ACM Organizing Core Team',
    subtitle: 'Student leaders driving tech culture and innovation',
    tag: 'ACM Team',
  },
  {
    src: '/heroImage/degnitries.webp',
    title: 'Distinguished Guests & Mentors',
    subtitle: 'Industry leaders sharing visionary insights with hackers',
    tag: 'Leadership',
  },
  {
    src: '/heroImage/prizeWinner.webp',
    title: 'Grand Prize Winners & Awards',
    subtitle: 'Celebrating exceptional ideas transformed into real products',
    tag: 'Champions',
  },
  {
    src: '/heroImage/acm%20membr.webp',
    title: 'ACM Chapter Community',
    subtitle: 'Passionate developers, creators, and innovators together',
    tag: 'Community',
  },
]

export function HeroImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const total = HERO_IMAGES.length

  const handleNext = useCallback(() => {
    setDirection('next')
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const handlePrev = useCallback(() => {
    setDirection('prev')
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev')
    setCurrentIndex(index)
  }

  // Auto-play timer (pauses when hovering)
  useEffect(() => {
    if (!isAutoPlay) return
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay, handleNext])

  // Touch swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 45) {
      handleNext()
    } else if (diff < -45) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div
      className="hero-stack-container"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 3D Stack Stage */}
      <div className="hero-stack-stage">
        {HERO_IMAGES.map((item, idx) => {
          // Calculate offset relative to current index: 0 is front, 1 is 1st behind, etc.
          const offset = (idx - currentIndex + total) % total

          // Only render visible cards in stack (front + 3 behind)
          let cardClass = 'hero-stack-card'
          let isInteractive = false

          if (offset === 0) {
            cardClass += ' is-active'
            isInteractive = true
          } else if (offset === 1) {
            cardClass += ' is-stacked-1'
          } else if (offset === 2) {
            cardClass += ' is-stacked-2'
          } else if (offset === 3) {
            cardClass += ' is-stacked-3'
          } else {
            cardClass += ' is-hidden'
          }

          return (
            <div
              key={item.src}
              className={cardClass}
              onClick={() => {
                if (offset !== 0) {
                  handleGoTo(idx)
                }
              }}
              role="group"
              aria-label={`Slide ${idx + 1}: ${item.title}`}
            >
              <div className="hero-stack-card-inner">
                <img
                  src={item.src}
                  alt={item.title}
                  className="hero-stack-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* Gradient shade & details on active card */}
                <div className="hero-stack-overlay">
                  <div className="hero-stack-top-badge">
                    <span>{item.tag}</span>
                  </div>
                  <div className="hero-stack-info">
                    <h4 className="hero-stack-title">{item.title}</h4>
                    <p className="hero-stack-sub">{item.subtitle}</p>
                  </div>
                </div>

                {/* Card index pill */}
                <div className="hero-stack-idx-pill">
                  <span>0{idx + 1}</span>
                  <span className="hero-stack-idx-sep">/</span>
                  <span className="hero-stack-idx-tot">0{total}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Controls: Left & Right Shift Buttons */}
      <button
        type="button"
        className="hero-stack-btn hero-stack-btn--prev"
        onClick={handlePrev}
        aria-label="Shift to previous photo"
        title="Previous image"
      >
        <ChevronLeft className="hero-stack-btn-icon" />
      </button>

      <button
        type="button"
        className="hero-stack-btn hero-stack-btn--next"
        onClick={handleNext}
        aria-label="Shift to next photo"
        title="Next image"
      >
        <ChevronRight className="hero-stack-btn-icon" />
      </button>

      {/* Bottom pagination dots & shift status */}
      <div className="hero-stack-footer">
        <div className="hero-stack-dots">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`hero-stack-dot ${i === currentIndex ? 'is-active' : ''}`}
              onClick={() => handleGoTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        <div className="hero-stack-hint">
          <span className="hero-stack-hint-dot" />
          <span>Click arrows or stack to shift photos</span>
        </div>
      </div>
    </div>
  )
}
