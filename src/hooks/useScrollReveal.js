import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const sel = '.reveal, .rv, .rv-left, .rv-right, .rv-scale, .rv-up'

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })

    const observe = () => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('visible')) observer.observe(el)
      })
    }

    observe()

    const mutation = new MutationObserver(observe)
    mutation.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutation.disconnect()
    }
  }, [])
}
