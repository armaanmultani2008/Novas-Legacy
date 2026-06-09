import { useTranslation } from 'react-i18next'

function Horses({ goTo }) {
  const { t } = useTranslation()

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/cavallo-puledro.png" alt="Progetto Cavalli" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('horses.hero_label')}</span>
          <h1>{t('horses.hero_title').split(' ').slice(0,-1).join(' ')} <em>{t('horses.hero_title').split(' ').slice(-1)}</em></h1>
          <p>{t('horses.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('horses.who_title').split(' ').slice(0,-1).join(' ')} <em>{t('horses.who_title').split(' ').slice(-1)}</em></h2>
          <p>{t('horses.who_p1')}</p>
          <p>{t('horses.who_p2')}</p>

          <div className="highlight">
            <p>{t('horses.highlight')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '2.5rem 0' }}>
            {[
              { src: '/img/volontario-recinzione.png', cap: 'Fence maintenance' },
              { src: '/img/volontari-lavoro.png',      cap: 'Team at work' },
            ].map((p, i) => (
              <div key={i} style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img src={p.src} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'none'} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>{p.cap}</div>
              </div>
            ))}
          </div>

          <h2>{t('horses.vol_title').split(' ').slice(0,-1).join(' ')} <em>{t('horses.vol_title').split(' ').slice(-1)}</em></h2>
          <p>{t('horses.vol_p1')}</p>
          <p>{t('horses.vol_p2')}</p>

          <div style={{ height: '320px', overflow: 'hidden', position: 'relative', margin: '2.5rem 0' }}>
            <img src="/img/ghepardo-erba.png" alt="Waterberg Reserve" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem 1.2rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>Nova&apos;s Legacy — Waterberg, Limpopo</div>
          </div>

          <h2>{t('horses.ecosystem_title').split(' ').slice(0,-1).join(' ')} <em>{t('horses.ecosystem_title').split(' ').slice(-1)}</em></h2>
          <p>{t('horses.ecosystem_p1')}</p>
          <p>{t('horses.ecosystem_p2')}</p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>{t('horses.btn1')}</button>
            <button className="btn btn-outline-dark" onClick={() => goTo('conservation')}>{t('horses.btn2')}</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Horses
