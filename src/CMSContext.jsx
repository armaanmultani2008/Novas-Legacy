import { createContext, useContext, useState, useEffect } from 'react'
import i18n from './i18n'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const CMSContext = createContext({ images: {}, ready: false })

export function CMSProvider({ children }) {
  const [images, setImages] = useState({})
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem('nl_content')) } catch { return null }
    })()

    const apply = d => {
      if (!d || !Object.keys(d).length) return
      i18n.addResourceBundle('en', 'translation', d, true, true)
      i18n.changeLanguage('en')
      if (d._images) setImages(d._images)
    }

    if (saved) {
      apply(saved)
      setReady(true)
    }

    fetch(`${API}/api/content`)
      .then(r => r.json())
      .then(d => {
        if (d && Object.keys(d).length > 0) {
          apply(d)
          localStorage.setItem('nl_content', JSON.stringify(d))
        }
        setReady(true)
      })
      .catch(() => {})
  }, [])

  if(!ready){
    return (
        <div style={{display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: 'sans-serif', color: '#999'}}>
          Loading Nova&apos;s Legacy...
        </div>
    )
  }

  return <CMSContext.Provider value={{ images, ready }}>{children}</CMSContext.Provider>
}

export const useCMSImages = () => useContext(CMSContext).images
