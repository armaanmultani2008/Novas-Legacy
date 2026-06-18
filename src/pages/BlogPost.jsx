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

function BlogPost({ goTo, postId }) {
  const { t } = useTranslation()
  const fallback = t('blog.posts', { returnObjects: true })

  const [posts, setPosts] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`)
        .then(r => r.json())
        .then(d => {
          // Allineamento struttura ad oggetto del database
          if (d.blog && d.blog.posts?.length) {
            setPosts(d.blog.posts)
          }
        })
        .catch(() => {})
  }, [])

  const items = posts || (Array.isArray(fallback) ? fallback.map((p, i) => ({ ...p, id: String(i), img: FALLBACK_IMGS[i] })) : [])
  const idx  = postId ?? 0
  const post = items[idx] || items[0]

  if (!post) return null

  const body = Array.isArray(post.body) ? post.body : []
  const img  = post.img || FALLBACK_IMGS[idx] || FALLBACK_IMGS[0]

  return (
      <>
        <div className="page-hero-img" style={{ height: '65dvh' }}>
          <img src={img} alt={post.title} style={{ objectPosition: 'center 40%' }} />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{post.tag}</span>
            <h1 style={{ maxWidth: '700px' }}>{post.title}</h1>
            <p style={{ opacity: 0.7 }}>{post.date}</p>
          </div>
        </div>

        <div className="page-content">
          <div className="container" >
            <div style={{ marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #EDE5D8', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <button className="btn btn-outline-dark" onClick={() => goTo('blog')}>
                ← {t('blog.back_to_blog')}
              </button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {idx > 0 && (
                    <button className="btn btn-outline-dark" onClick={() => goTo('blog-post', null, idx - 1)}>
                      ‹ {t('blog.prev_post')}
                    </button>
                )}
                {idx < items.length - 1 && (
                    <button className="btn btn-dark" onClick={() => goTo('blog-post', null, idx + 1)}>
                      {t('blog.next_post')} ›
                    </button>
                )}
              </div>
            </div>

            <div className="highlight" style={{ margin: '2rem 0' }}>
              <p style={{ fontStyle: 'italic' }}>{post.excerpt}</p>
            </div>

            {body.map((para, i) => (
                <p key={i} style={{ lineHeight: '1.8', marginBottom: '1.2rem', color: '#333' }}>{para}</p>
            ))}
          </div>
        </div>
      </>
  )
}

export default BlogPost