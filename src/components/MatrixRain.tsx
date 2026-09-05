import { useEffect, useRef } from 'react'

/**
 * Canvas-based binary rain (0/1) scrolling bottom → top.
 * Fully transparent canvas — only the digits are drawn, so the
 * CSS gradient background shows through perfectly.
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const fontSize = 14
    const chars = '01'
    let w = 0
    let h = 0
    let cols = 0

    // Each column: { y: current row offset, speed: rows per frame, opacity: base opacity }
    let streams: { y: number; speed: number; opacity: number; length: number }[] = []

    function initStream() {
      return {
        y: Math.random() * (h / fontSize),
        speed: 0.15 + Math.random() * 0.35,
        opacity: 0.03 + Math.random() * 0.07,
        length: 8 + Math.floor(Math.random() * 20),
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = canvas!.offsetWidth
      h = canvas!.offsetHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(w / fontSize)
      streams = Array.from({ length: cols }, () => initStream())
    }

    resize()
    window.addEventListener('resize', resize)

    let lastTime = 0
    const frameInterval = 1000 / 20 // ~20fps for subtle effect

    function draw(time: number) {
      animId = requestAnimationFrame(draw)

      // Throttle to ~20fps
      if (time - lastTime < frameInterval) return
      lastTime = time

      // Clear canvas fully — transparent so CSS bg shows through
      ctx!.clearRect(0, 0, w, h)

      ctx!.font = `${fontSize}px "DM Mono", monospace`
      ctx!.textAlign = 'center'

      for (let i = 0; i < cols; i++) {
        const stream = streams[i]
        const x = i * fontSize + fontSize / 2

        // Draw a trail of characters for this stream
        for (let j = 0; j < stream.length; j++) {
          const rowY = stream.y - j
          const screenY = h - rowY * fontSize

          // Skip if off-screen
          if (screenY < -fontSize || screenY > h + fontSize) continue

          const char = chars[Math.floor(Math.random() * chars.length)]

          // Head character is brighter, tail fades out
          const fadeRatio = 1 - j / stream.length
          const alpha = stream.opacity * fadeRatio

          ctx!.fillStyle = `rgba(139, 92, 246, ${alpha})`
          ctx!.fillText(char, x, screenY)
        }

        // Advance upward
        stream.y += stream.speed

        // Reset when entire trail is off screen top
        if (h - (stream.y - stream.length) * fontSize < -fontSize) {
          streams[i] = initStream()
          streams[i].y = 0
        }
      }
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
