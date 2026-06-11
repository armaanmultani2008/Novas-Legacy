import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../components/Lightbox'
import { useCMSImages } from '../CMSContext'

const PHOTOS = [
  { src: '/img/nova-primo-piano.png' },
  { src: '/img/nova-madre-cucciolo.png' },
  { src: '/img/ghepardo-erba.png' },
  { src: '/img/due-ghepardi.png' },
]
const PHOTO_SRCS = PHOTOS.map(p => p.src)

function NovaStory({ goTo }) {
  const { t } = useTranslation()
  const cmsImages = useCMSImages()
  const photoCaps = t('nova_story.photo_caps', { returnObjects: true })
  const [lbIdx, setLbIdx] = useState(null)

  return (
    <>
      <div className="page-hero-img">
        <img
          src={cmsImages.nova_story_hero || '/img/nova-madre-cucciolo.png'}
          alt="Nova — la gheparda fondatrice"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('nova_story.hero_label')}</span>
          <h1>{t('nova_story.hero_title')}</h1>
          <p>{t('nova_story.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <h2>{t('nova_story.origins_title')}</h2>
          <p>{t('nova_story.origins_p1')}</p>
          <p>{t('nova_story.origins_p2')}</p>

          <div className="highlight">
            <p>{t('nova_story.highlight')}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            margin: '2.5rem 0',
          }}>
            {PHOTOS.map((p, i) => (
              <div
                key={i}
                style={{ height: '260px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                onClick={() => setLbIdx(i)}
              >
                <img
                  src={p.src}
                  alt={photoCaps[i]}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'none'}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                  padding: '0.8rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                }}>{photoCaps[i]}</div>
              </div>
            ))}
          </div>

          {lbIdx !== null && (
            <Lightbox srcs={PHOTO_SRCS} captions={photoCaps} idx={lbIdx} setIdx={setLbIdx} />
          )}

          <h2>{t('nova_story.genetics_title')}</h2>
          <p>{t('nova_story.genetics_p1')}</p>
          <p>{t('nova_story.genetics_p2')}</p>
          <p>{t('nova_story.genetics_p3')}</p>

          <h2>{t('nova_story.legacy_title')}</h2>
          <p>{t('nova_story.legacy_p1')}</p>
          <p>{t('nova_story.legacy_p2')}</p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('cheetah-run')}>
              {t('nova_story.btn1')}
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>
              {t('nova_story.btn2')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NovaStory
