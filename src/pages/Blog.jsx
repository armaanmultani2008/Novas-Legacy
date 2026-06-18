import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FALLBACK_IMGS = [
  '/img/cucciolata.png',
  '/img/blog-post.png',
  '/img/cheetah-blog.png',
  '/img/cavallo-puledro.png',
  '/img/children-visit.png',
  '/img/ghepardo-corsa-recinzione.png',
]

function Blog({ goTo }) {
  const { t } = useTranslation()
  const fallback = t('blog.posts', { returnObjects: true })

  const [posts, setPosts] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`)
        .then(r => r.json())
        .then(d => {
          if (d.blog && d.blog.posts?.length) {
            setPosts(d.blog.posts)
          }
        })
        .catch(() => {})
  }, [])

  const items = posts || (Array.isArray(fallback) ? fallback.map((p, i) => ({ ...p, id: String(i), img: FALLBACK_IMGS[i] })) : [])

  return (
      <>
        <div className="page-hero-img" style={{height: '65dvh'}}>
          <img src="/img/ghepardo-corsa-2.png" alt="Blog Nova's Legacy" style={{ objectPosition: 'center 20%' }} />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('blog.hero_label')}</span>
            <h1>{t('blog.hero_title')}</h1>
            <p>{t('blog.hero_sub')}</p>
          </div>
        </div>

        <div className="page-content">
          <div className="container" style={{ maxWidth: '1100px' }}>
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <div className="page-grid-3">
              {items.map((p, i) => (
                  <div
                      key={p.id || p.title || i}
                      style={{
                        background: 'var(--off-white)',
                        border: '1px solid #EDE5D8',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      onClick={() => goTo('blog-post', null, i)}
                  >
                    <div style={{ height: '250px', overflow: 'hidden' }}>
                      <img src={p.img || FALLBACK_IMGS[i] || FALLBACK_IMGS[0]} alt={p.title}
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>{p.tag}</span>
                        <span style={{ fontSize: '0.72rem', color: '#AAA' }}>{p.date}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', lineHeight: '1.3', marginBottom: '0.6rem', color: 'var(--dark)' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.83rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1rem' }}>{p.excerpt}</p>
                      <span style={{ fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark)' }}>
                    {t('blog.read_all')}
                  </span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </>
  )
}

export default Blog