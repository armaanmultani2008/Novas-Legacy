import { useTranslation } from 'react-i18next'

const CHALET_IMGS = [
  '/img/chalet-esterno.png',
  '/img/chalet-esterno-2.png',
  '/img/chalet-camera.png',
]

function Visit({ goTo }) {
  const { t } = useTranslation()
  const chalets = t('visit.chalets', { returnObjects: true })

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/chalet-esterno.png" alt="Soggiorno a Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('visit.hero_label')}</span>
          <h1>{t('visit.hero_title')}</h1>
          <p>{t('visit.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('visit.chalets_title')}</h2>
          <p>{t('visit.chalets_p')}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '2rem 0 3rem' }}>
            {chalets.map((c, i) => (
              <div key={c.name} style={{ border: '1px solid #EDE5D8', overflow: 'hidden', background: 'var(--off-white)' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={CHALET_IMGS[i]} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>{c.size}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', marginBottom: '0.6rem', color: 'var(--dark)' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.65', fontWeight: 300 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>{t('visit.how_title')}</h2>
          <p>{t('visit.how_p1')}</p>
          <p>{t('visit.how_p2')}</p>

          <div className="highlight">
            <p>{t('visit.highlight')}</p>
          </div>

          <h2>{t('visit.add_run_title')}</h2>
          <p>{t('visit.add_run_p')}</p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              {t('visit.btn_book')}
            </a>
            <button className="btn btn-outline-dark" onClick={() => goTo('cheetah')}>
              {t('visit.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Visit
