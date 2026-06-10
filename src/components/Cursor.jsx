import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const mouse    = useRef({ x: -200, y: -200 })
  const ringPos  = useRef({ x: -200, y: -200 })
  const rafId    = useRef(null)

  useEffect(() => {
    // Only on hover-capable devices (not touch)
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove, { passive: true })

    const lerp = (a, b, n) => a + (b - a) * n

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.1)
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.1)
      dot.current?.style.setProperty('transform',
        `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`)
      ring.current?.style.setProperty('transform',
        `translate(${ringPos.current.x}px,${ringPos.current.y}px) translate(-50%,-50%)`)
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    const TARGETS = 'a,button,[role="button"],.pillar,.program-card,.shop-card,.animal-card,.gm-item,.back-btn'
    const expand = (e) => {
      if (e.target.closest(TARGETS)) {
        ring.current?.classList.add('cur--hover')
        dot.current?.classList.add('cur--hover')
      }
    }
    const collapse = (e) => {
      if (e.target.closest(TARGETS)) {
        ring.current?.classList.remove('cur--hover')
        dot.current?.classList.remove('cur--hover')
      }
    }
    document.addEventListener('mouseover', expand)
    document.addEventListener('mouseout', collapse)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', expand)
      document.removeEventListener('mouseout', collapse)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className="cur-dot" />
      <div ref={ring} className="cur-ring" />
    </>
  )
}
