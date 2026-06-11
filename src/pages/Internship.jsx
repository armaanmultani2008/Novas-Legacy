import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import Lightbox from '../components/Lightbox'

const FIELD_IMGS = [
  '/img/int-field-1.jpg',
  '/img/int-field-2.jpg',
  '/img/int-field-3.jpg',
  '/img/int-field-4.jpg',
  '/img/int-field-5.jpg',
  '/img/int-field-6.jpg',
]

const PHOTOS = [
  '/img/int-photo-1.jpg',
  '/img/int-photo-2.jpg',
  '/img/int-photo-3.jpg',
  '/img/int-photo-4.jpg',
]

const ALL_IMGS = [...PHOTOS, ...FIELD_IMGS]

function Internship({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const fieldLabels = t('internship.field_labels', { returnObjects: true })
  const [lbIdx, setLbIdx] = useState(null)

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/int-hero.jpg" alt="Internship Nova's Legacy" style={{ objectPosition: 'center 40%' }} />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('internship.hero_label')}</span>
          <h1>{t('internship.hero_title')}</h1>
          <p>{t('internship.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => goTo('home', 'contact')} className="btn btn-dark">
              {t('internship.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('volunteer')}>
              {t('internship.btn2')}
            </button>
          </div>

          <h2>{t('internship.learn_title')}</h2>
          <p>{t('internship.learn_p1')}</p>
          <p>{t('internship.learn_p2')}</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            margin: '2.5rem 0',
          }}>
            {PHOTOS.map((src, i) => (
              <div
                key={i}
                className="rv"
                style={{
                  height: '180px',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  transitionDelay: `${i * 0.08}s`,
                  cursor: 'pointer',
                }}
                onClick={() => setLbIdx(i)}
              >
                <img
                  src={src}
                  alt={`Internship ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'none'}
                />
              </div>
            ))}
          </div>

          <div className="highlight">
            <p>{t('internship.highlight')}</p>
          </div>

          <h2>{t('internship.fields_title')}</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            margin: '1.5rem 0 2.5rem',
          }}>
            {fieldLabels.map((label, i) => (
              <div
                key={label}
                className="rv"
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid #EDE5D8',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  transitionDelay: `${i * 0.07}s`,
                }}
              >
                <div
                  style={{ height: '130px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                  onClick={() => setLbIdx(PHOTOS.length + i)}
                >
                  <img
                    src={FIELD_IMGS[i]}
                    alt={label}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.75) saturate(0.8)',
                      transition: 'transform 0.4s',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'none'}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                  }} />
                </div>
                <div style={{ padding: '0.9rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.6rem', flexShrink: 0 }}>◆</span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--dark)', lineHeight: 1.4 }}>{label}</span>
                </div>
              </div>
            ))}
          </div>

          {lbIdx !== null && (
            <Lightbox srcs={ALL_IMGS} idx={lbIdx} setIdx={setLbIdx} />
          )}

          <h2>{t('internship.includes_title')}</h2>
          <p>{t('internship.includes_p')}</p>

          <h2>{t('internship.duration_title')}</h2>
          <p>{t('internship.duration_p')}</p>

        </div>
      </div>
    </>
  )
}

export default Internship
