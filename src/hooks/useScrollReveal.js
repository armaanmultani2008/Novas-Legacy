import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })

    const sel = '.reveal, .rv, .rv-left, .rv-right, .rv-scale, .rv-up'
    const elements = document.querySelectorAll(sel)
    elements.forEach(el => {
      el.classList.remove('visible')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}
