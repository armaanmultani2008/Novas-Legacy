import { useTranslation } from 'react-i18next'

const POST_IMGS = [
  '/img/nova-madre-cucciolo.png',
  '/img/volontari-lavoro.png',
  '/img/due-ghepardi.png',
  '/img/cavallo-puledro.png',
  '/img/volontari-gruppo.png',
  '/img/ghepardo-corsa-recinzione.png',
]

function Blog({ goTo }) {
  const { t } = useTranslation()
  const posts = t('blog.posts', { returnObjects: true })

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/ghepardo-erba.png" alt="Blog Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('blog.hero_label')}</span>
          <h1>{t('blog.hero_title')}</h1>
          <p>{t('blog.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginTop: '0.5rem',
          }}>
            {posts.map((p, i) => (
              <div
                key={p.title}
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid #EDE5D8',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={POST_IMGS[i]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
