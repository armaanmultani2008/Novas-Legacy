import { useTranslation } from 'react-i18next'

const POST_IMGS = [
  '/img/nova-madre-cucciolo.png',
  '/img/volontari-lavoro.png',
  '/img/due-ghepardi.png',
  '/img/cavallo-puledro.png',
  '/img/volontari-gruppo.png',
  '/img/ghepardo-corsa-recinzione.png',
]

function BlogPost({ goTo, postId }) {
  const { t } = useTranslation()
  const posts = t('blog.posts', { returnObjects: true })
  const idx   = postId ?? 0
  const post  = posts[idx] || posts[0]
  const body  = Array.isArray(post.body) ? post.body : []

  return (
    <>
      <div className="page-hero-img" style={{ height: '50vh' }}>
        <img src={POST_IMGS[idx] || POST_IMGS[0]} alt={post.title} style={{ objectPosition: 'center 40%' }} />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{post.tag}</span>
          <h1 style={{ maxWidth: '700px' }}>{post.title}</h1>
          <p style={{ opacity: 0.7 }}>{post.date}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container" style={{ maxWidth: '740px' }}>
          <span className="back-btn" onClick={() => goTo('blog')}>{t('blog.back_to_blog')}</span>

          <div className="highlight" style={{ margin: '2rem 0' }}>
            <p style={{ fontStyle: 'italic' }}>{post.excerpt}</p>
          </div>

          {body.map((para, i) => (
            <p key={i} style={{ lineHeight: '1.8', marginBottom: '1.2rem', color: '#333' }}>{para}</p>
          ))}

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #EDE5D8', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <button className="btn btn-outline-dark" onClick={() => goTo('blog')}>
              ← {t('blog.back_to_blog')}
            </button>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {idx > 0 && (
                <button className="btn btn-outline-dark" onClick={() => goTo('blog-post', null, idx - 1)}>
                  ‹ {t('blog.prev_post')}
                </button>
              )}
              {idx < posts.length - 1 && (
                <button className="btn btn-dark" onClick={() => goTo('blog-post', null, idx + 1)}>
                  {t('blog.next_post')} ›
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogPost
