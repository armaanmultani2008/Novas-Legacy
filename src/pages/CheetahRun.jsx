import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const SLIDE_IMGS = [
  '/img/ghepardo-corsa.png',
  '/img/ghepardo-corsa-2.png',
  '/img/ghepardo-corsa-3.png',
  '/img/ghepardo-corsa-erba-gialla.png',
  '/img/ghepardo-corsa-recinzione.png',
]

const STATS = [
  { num: '112', unit: ' km/h' },
  { num: '3',   unit: ' sec' },
  { num: '60',  unit: ' m' },
  { num: '7',   unit: ' m' },
]

function CheetahRun({ goTo }) {
  const [slide, setSlide] = useState(0)
  const { t } = useTranslation()
  const statLabels = t('cheetah_run.stat_labels', { returnObjects: true })

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % SLIDE_IMGS.length), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="page-hero-img" style={{ position: 'relative', overflow: 'hidden' }}>
        {SLIDE_IMGS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Cheetah Run"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 0.9s ease-in-out',
            }}
          />
        ))}
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('cheetah_run.hero_label')}</span>
          <h1>{t('cheetah_run.hero_title')}</h1>
          <p>{t('cheetah_run.hero_sub')}</p>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10,
        }}>
          {SLIDE_IMGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === slide ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('cheetah_run.title')}</h2>
          <p>{t('cheetah_run.p1')}</p>

          <div className="highlight">
            <p>{t('cheetah_run.highlight')}</p>
          </div>

          <h2>{t('cheetah_run.how_title')}</h2>
          <p>{t('cheetah_run.how_p1')}</p>
          <p>{t('cheetah_run.how_p2')}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', margin: '2.5rem 0' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: 'var(--dark)',
                color: 'white',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: '1rem', fontWeight: 400 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                  {statLabels[i]}
                </div>
              </div>
            ))}
          </div>

          <h2>{t('cheetah_run.practical_title')}</h2>
          <p>{t('cheetah_run.practical_p')}</p>

          <div className="highlight">
            <p>{t('cheetah_run.booking_highlight')}</p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              {t('cheetah_run.btn1')}
            </a>
            <button className="btn btn-outline-dark" onClick={() => goTo('nova-story')}>
              {t('cheetah_run.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheetahRun
