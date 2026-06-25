import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

function AnimalModal({ animal, onClose }) {
  const images = [animal.img, ...(animal.gallery || [])].filter(Boolean)
  const [activeIdx, setActiveIdx] = useState(0)
  const pushedRef = useRef(false)

  useBodyScrollLock(true)

  useEffect(() => {
    if (!pushedRef.current) {
      window.history.pushState({ ...(window.history.state || {}), animalModalOpen: true }, '')
      pushedRef.current = true
    }
    function onPopState(e) {
      if (!e.state?.animalModalOpen) onClose()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const requestClose = () => {
    if (window.history.state?.animalModalOpen) window.history.back()
    else onClose()
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') requestClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const activeCaption = activeIdx === 0 ? null : animal.gallery?.[activeIdx - 1]?.caption

  return createPortal(
    <div className="am-overlay" onClick={requestClose}>
      <div className="am-card" onClick={e => e.stopPropagation()}>
        <button className="am-close" onClick={requestClose}>✕</button>

        <div className="am-media">
          <img src={images[activeIdx]} alt={animal.name} />
          {activeCaption && <span className="am-media-caption">{activeCaption}</span>}
        </div>

        {images.length > 1 && (
            <div className="am-thumbs">
              {images.map((src, i) => (
                  <button
                      key={src + i}
                      className={`am-thumb${i === activeIdx ? ' am-thumb--on' : ''}`}
                      onClick={() => setActiveIdx(i)}
                  >
                    <img src={src} alt="" />
                  </button>
              ))}
            </div>
        )}

        <div className="am-body">
          {animal.role && <span className="am-role">{animal.role}</span>}
          <h3 className="am-name" style={{fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            marginBottom: '0.5rem',
            color: 'var(--dark)',
            lineHeight: '1.3'}}>{animal.name}</h3>
          {animal.bio && <p className="am-bio">{animal.bio}</p>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default AnimalModal
