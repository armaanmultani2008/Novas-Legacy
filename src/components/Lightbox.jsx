import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

function Lightbox({ srcs, captions, idx, setIdx }) {
  const n = srcs.length
  const isOpen = idx != null && idx >= 0 && idx < n
  const close = () => setIdx(null)
  const prev  = () => setIdx(i => (i - 1 + n) % n)
  const next  = () => setIdx(i => (i + 1) % n)
  const pushedRef = useRef(false)

  useBodyScrollLock(true)

  useEffect(() => {
    if (!isOpen) return
    if (!pushedRef.current) {
      window.history.pushState({ ...(window.history.state || {}), lightboxOpen: true }, '')
      pushedRef.current = true
    }
    function onPopState(e) {
      if (!e.state?.lightboxOpen) close()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isOpen])

  const requestClose = () => {
    if (window.history.state?.lightboxOpen) window.history.back()
    else close()
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     requestClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  if (!isOpen) return null

  return createPortal(
    <div className="lb-overlay" onClick={requestClose}>
      <button className="lb-close" onClick={e => { e.stopPropagation(); requestClose() }}>✕</button>
      <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); prev() }}>‹</button>
      <div className="lb-content" onClick={e => e.stopPropagation()}>
        <img src={srcs[idx]} alt={captions?.[idx] ?? ''} />
        {captions?.[idx] && <p className="lb-caption">{captions[idx]}</p>}
      </div>
      <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); next() }}>›</button>
    </div>,
    document.body
  )
}

export default Lightbox
