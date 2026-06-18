import { useTranslation } from 'react-i18next'
import { useCMSImages } from '../CMSContext'

function Visit({ goTo }) {
  const { t } = useTranslation()
  const cmsImages = useCMSImages()
  const chalets = t('visit.chalets', { returnObjects: true })

  return (
    <>
      <div className="page-hero-img" style={{height: '75dvh'}}>
        <img src={cmsImages.visit_hero || '/img/chalet-esterno.png'} alt="Stay at Nova's Legacy" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('visit.hero_label')}</span>
          <h1>{t('visit.hero_title').split(' ').slice(0, -2).join(' ')} <em>{t('visit.hero_title').split(' ').slice(-2).join(' ')}</em></h1>
          <p>{t('visit.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content" style={{ padding: '4rem 1.5rem'}}>
        <div className="container" style={{maxWidth: '1100px'}}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => goTo('home', 'contact')} className="btn btn-dark">
              {t('visit.btn_book')}
            </button>
          </div>

          <h2>{t('visit.chalets_title').split(', ')[0]}, <em>{t('visit.chalets_title').split(', ')[1]}</em></h2>
          <p>{t('visit.chalets_p')}</p>

          <div className="chalets-grid">
            {chalets.map(c => (
              <div key={c.name} style={{ border: '1px solid #EDE5D8', overflow: 'overflow', background: 'var(--off-white)', borderRadius: '8px' }}>
                <div style={{ height: '320px', overflow: 'hidden' }}>
                  {c.name === 'Chalet Nova' && <img src="/img/chalet-cucina.png" alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {c.name === 'Chalet Bush' && <img src="/img/chalet-esterno-2.png" alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {c.name === 'Chalet Waterberg' && <img src="/img/chalet-camera.png" alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>{c.size}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', marginBottom: '0.6rem', color: 'var(--dark)' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.65', fontWeight: 300 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .chalet-grid-imgs {
              display: grid;
              grid-template-columns: 1fr 1fr; /* 2 colonne su desktop */
              gap: 6px;
              margin: 2.5rem 0;
            }
            
            @media (max-width: 900px) {
              .chalet-grid-imgs {
                grid-template-columns: 1fr; /* 1 colonna sotto i 900px */
              }
            }
          `}</style>
          <div className="chalet-grid-imgs">
            {[
              { src: '/img/external.jpg', cap: 'External space' },
              { src: '/img/thutlwa.jpg',    cap: 'Peaceful place' },
            ].map((p, i) => (
                <div key={i} style={{ height: '300px', overflow: 'hidden', position: 'relative', borderRadius: '6px' }}>
                  <img
                      src={p.src}
                      alt={p.cap}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s', objectPosition: i === 0 ? 'center 110%' : 'center' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                      onMouseLeave={e => e.target.style.transform = 'none'}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    padding: '0.8rem', color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.68rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', pointerEvents: 'none'
                  }}>
                    {p.cap}
                  </div>
                </div>
            ))}
          </div>

          <h2>{t('visit.how_title').split(' ').slice(0,-1).join(' ')} <em>{t('visit.how_title').split(' ').slice(-1)}</em></h2>
          <p>{t('visit.how_p1')}</p>
          <p>{t('visit.how_p2')}</p>

          <div style={{ margin: '2rem 0' }}>
            <iframe
              src="https://maps.google.com/maps?q=-24.845059,28.240967&z=14&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, display: 'block', borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nova's Legacy — Bela-Bela, South Africa"
            />
          </div>

          <div className="highlight">
            <p>{t('visit.highlight')}</p>
          </div>

          <h2>{t('visit.add_run_title').split(' ').slice(0,-2).join(' ')} <em>{t('visit.add_run_title').split(' ').slice(-2).join(' ')}</em></h2>
          <p>{t('visit.add_run_p')}</p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-outline-dark" onClick={() => goTo('cheetah-run')}>
              {t('visit.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Visit
