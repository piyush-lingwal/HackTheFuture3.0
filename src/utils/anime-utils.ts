/**
 * Lightweight Anime.js v4 animation utilities.
 * Used across all sub-pages for scroll-reveal + state animations.
 *
 * Functions:
 *   enter()          — immediate stagger-in (hero / page load)
 *   reveal()         — single element scroll-triggered reveal
 *   staggerReveal()  — list of elements scroll-triggered stagger
 *   popIn()          — scale-bounce reveal (CTAs, featured cards)
 *   staggerNow()     — immediate stagger for state changes (tabs etc.)
 */
import { animate, stagger } from 'animejs'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RevealOpts {
  y?: number
  x?: number
  duration?: number
  easing?: string
  delay?: number
  threshold?: number
}

export interface StaggerOpts extends RevealOpts {
  stagger?: number
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function hide(el: HTMLElement, y: number, x: number): void {
  el.style.opacity = '0'
  el.style.transform = `translateY(${y}px) translateX(${x}px)`
  el.style.willChange = 'opacity, transform'
}

function clearWill(els: Element[]): void {
  els.forEach(el => { (el as HTMLElement).style.willChange = 'auto' })
}

function watch(
  el: Element,
  cb: () => void,
  threshold: number
): IntersectionObserver {
  const io = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { cb(); io.disconnect() } },
    { threshold }
  )
  io.observe(el)
  return io
}

// Map traditional easing names to Anime v4 ease format if needed
function mapEase(ease: string): string {
  if (ease === 'easeOutExpo') return 'outExpo'
  if (ease === 'easeOutBack') return 'outBack'
  if (ease === 'easeOutCubic') return 'outCubic'
  return ease
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Animate elements in immediately on page load (hero sections).
 * No scroll trigger — fires after a short delay.
 */
export function enter(els: Element[], opts: StaggerOpts = {}): void {
  if (!els.length) return
  const {
    y = 32, x = 0,
    duration = 760, easing = 'outExpo',
    delay = 80, stagger: stag = 80,
  } = opts
  els.forEach(el => hide(el as HTMLElement, y, x))
  setTimeout(() => {
    animate(els, {
      opacity: [0, 1],
      translateY: [y, 0],
      translateX: [x, 0],
      duration,
      ease: mapEase(easing),
      delay: stagger(stag),
      onComplete: () => clearWill(els),
    })
  }, delay)
}

/**
 * Scroll-triggered reveal for a single element.
 * Returns the IntersectionObserver so callers can disconnect on unmount.
 */
export function reveal(el: Element, opts: RevealOpts = {}): IntersectionObserver {
  const {
    y = 36, x = 0,
    duration = 820, easing = 'outExpo',
    delay = 0, threshold = 0.12,
  } = opts
  hide(el as HTMLElement, y, x)
  return watch(el, () => setTimeout(() => {
    animate(el, {
      opacity: [0, 1],
      translateY: [y, 0],
      translateX: [x, 0],
      duration,
      ease: mapEase(easing),
      onComplete: () => clearWill([el]),
    })
  }, delay), threshold)
}

/**
 * Scroll-triggered stagger for a list of elements.
 * Observes either the first element or an explicit trigger element.
 * Returns the observer for cleanup (or null if list is empty).
 */
export function staggerReveal(
  els: Element[],
  opts: StaggerOpts = {},
  trigger?: Element
): IntersectionObserver | null {
  if (!els.length) return null
  const {
    y = 40, x = 0,
    duration = 750, easing = 'outExpo',
    delay = 0, stagger: stag = 85, threshold = 0.1,
  } = opts
  els.forEach(el => hide(el as HTMLElement, y, x))
  return watch(trigger || els[0], () => setTimeout(() => {
    animate(els, {
      opacity: [0, 1],
      translateY: [y, 0],
      translateX: [x, 0],
      duration,
      ease: mapEase(easing),
      delay: stagger(stag),
      onComplete: () => clearWill(els),
    })
  }, delay), threshold)
}

/**
 * Scale-bounce pop-in (great for featured cards, CTAs, pool banners).
 * Returns the observer for cleanup.
 */
export function popIn(
  el: Element,
  opts: { delay?: number; duration?: number; threshold?: number } = {}
): IntersectionObserver {
  const h = el as HTMLElement
  h.style.opacity = '0'
  h.style.transform = 'scale(0.88)'
  h.style.willChange = 'opacity, transform'
  return watch(el, () => setTimeout(() => {
    animate(el, {
      opacity: [0, 1],
      scale: [0.88, 1],
      duration: opts.duration ?? 680,
      ease: 'outBack',
      onComplete: () => clearWill([el]),
    })
  }, opts.delay ?? 0), opts.threshold ?? 0.1)
}

/**
 * Immediate stagger for state-driven content (tab switches, filter changes).
 * Does NOT use IntersectionObserver — fires on the next animation frame.
 */
export function staggerNow(els: Element[], opts: StaggerOpts = {}): void {
  if (!els.length) return
  const {
    y = 20, duration = 520, easing = 'outExpo', stagger: stag = 55,
  } = opts
  els.forEach(el => {
    const h = el as HTMLElement
    h.style.opacity = '0'
    h.style.transform = `translateY(${y}px)`
    h.style.willChange = 'opacity, transform'
  })
  requestAnimationFrame(() => {
    animate(els, {
      opacity: [0, 1],
      translateY: [y, 0],
      duration,
      ease: mapEase(easing),
      delay: stagger(stag),
      onComplete: () => clearWill(els),
    })
  })
}
