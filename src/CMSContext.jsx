import { createContext, useContext, useState, useEffect } from 'react'
import i18n from './i18n'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const CMSContext = createContext({ images: {} })

export function CMSProvider({ children }) {
  const [images, setImages] = useState({})

  useEffect(() => {
    // Carica contenuto personalizzato e sovrascrive i18n
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem('nl_content')) } catch { return null }
    })()

    const apply = d => {
      if (!d || !Object.keys(d).length) return
      i18n.addResourceBundle('en', 'translation', d, true, true)
      if (d._images) setImages(d._images)
    }

    // Usa subito il localStorage mentre aspetta il backend
    if (saved) apply(saved)

    fetch(`${API}/api/content`)
      .then(r => r.json())
      .then(d => {
        if (d && Object.keys(d).length > 0) {
          apply(d)
          localStorage.setItem('nl_content', JSON.stringify(d))
        }
      })
      .catch(() => {})
  }, [])

  return <CMSContext.Provider value={{ images }}>{children}</CMSContext.Provider>
}

export const useCMSImages = () => useContext(CMSContext).images
