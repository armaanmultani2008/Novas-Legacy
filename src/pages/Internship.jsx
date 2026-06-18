import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import Lightbox from '../components/Lightbox'
import { useCMSImages } from '../CMSContext'

const PHOTOS_DEFAULT = [
  '/img/internship.png',
  '/img/internship2.png',
]

const FOTO_SOTTO_DEFAULT = [
  '/img/medicine-internship.png',
  '/img/hard-work-internship.png',
]

function Internship({ goTo }) {
  useScrollReveal()
  const { t } = useTranslation()
  const cmsImages = useCMSImages()
  const fieldLabels = t('internship.field_labels', { returnObjects: true })
  const [lbIdx, setLbIdx] = useState(null)
  const photos    = PHOTOS_DEFAULT.map((def, i) => cmsImages[`internship_photo_${i + 1}`] || def)
  const fotoSotto = FOTO_SOTTO_DEFAULT.map((def, i) => cmsImages[`internship_photo_${PHOTOS_DEFAULT.length + i + 1}`] || def)
  const allImgs   = [...photos, ...fotoSotto]

  return (
      <>
        <style>{`
        .grid-2-col, .grid-3-col {
          display: grid;
          gap: 1rem;
          margin: 2.5rem 0;
          grid-template-columns: 1fr; /* 1 colonna di base su Mobile */
        }
        @media (min-width: 768px) {
          .grid-2-col {
            grid-template-columns: repeat(2, 1fr); 
          }
          .grid-3-col {
            grid-template-columns: repeat(3, 1fr); 
          }
        }
        .new-images-container {
          display: grid;
          gap: 12px;
          margin: 2.5rem 0;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .new-images-container {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

        <div className="page-hero-img" style={{height: "65dvh"}}>
          <img src={cmsImages.internship_hero || '/img/internship-hero.png'} alt="Internship Nova's Legacy" style={{ objectPosition: 'center 40%' }} />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('internship.hero_label')}</span>
            <h1>{t('internship.hero_title')}</h1>
            <p>{t('internship.hero_sub')}</p>
          </div>
        </div>

        <div className="page-content" style={{ padding: '4rem 1.5rem'}}>
          <div className="container" style={{maxWidth: '1100px', margin: '0 auto'}}>
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

            <div className="grid-2-col">
              {photos.map((src, i) => (
                  <div
                      key={i}
                      className="rv"
                      style={{
                        height: '320px',
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

            <div className="grid-3-col" style={{ margin: '1.5rem 0' }}>
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
                        padding: '1.5rem 1.2rem',
                        display: 'flex',
                        gap: '0.8rem',
                        alignItems: 'center',
                        minHeight: '80px'
                      }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem', flexShrink: 0 }}>◆</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--dark)', lineHeight: 1.4 }}>{label}</span>
                  </div>
              ))}
            </div>

            <div className="new-images-container">
              <div
                  style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => setLbIdx(photos.length + 0)}
              >
                <img
                    src={fotoSotto[0]}
                    alt="Internship section detail 1"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'none'}
                />
              </div>
              <div
                  style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => setLbIdx(photos.length + 1)}
              >
                <img
                    src={fotoSotto[1]}
                    alt="Internship section detail 2"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'none'}
                />
              </div>
            </div>

            {lbIdx !== null && (
                <Lightbox srcs={allImgs} idx={lbIdx} setIdx={setLbIdx} />
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