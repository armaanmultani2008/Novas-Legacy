import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function Lightbox({ srcs, captions, idx, setIdx }) {
  const n = srcs.length
  const close = () => setIdx(null)
  const prev  = () => setIdx(i => (i - 1 + n) % n)
  const next  = () => setIdx(i => (i + 1) % n)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return createPortal(
    <div className="lb-overlay" onClick={close}>
      <button className="lb-close" onClick={close}>✕</button>
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
