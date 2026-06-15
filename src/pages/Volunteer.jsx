import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../components/Lightbox'
import { useCMSImages } from '../CMSContext'

const VOL_PHOTO_SRCS = [
  '/img/animal-care.png',
  '/img/daily-work.png',
  '/img/with-the-cheetahs.png',
  '/img/in-the-bush.png',
  '/img/feeding.png',
  '/img/team-in-action.png',
]

function Volunteer({ goTo }) {
  const { t } = useTranslation()
  const cmsImages = useCMSImages()
  const schedule  = t('volunteer.schedule',   { returnObjects: true })
  const tasks     = t('volunteer.tasks',      { returnObjects: true })
  const photoCaps = t('volunteer.photo_caps', { returnObjects: true })
  const [lbIdx, setLbIdx] = useState(null)

  return (
      <>
        <div className="page-hero-img" style={{
          height: '75vh',
          minHeight: '450px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
              src={cmsImages.volunteer_hero || '/img/vol-volontari-1.jpg'}
              alt="Volontari a Nova's Legacy"
              className={'page-hero-img-photo'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%'
              }}
          />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('volunteer.hero_label')}</span>
            <h1>{t('volunteer.hero_title')}</h1>
            <p>{t('volunteer.hero_sub')}</p>
          </div>
        </div>

        <style>{`
          @media (max-width: 1080px) { .page-hero-img-photo { object-position: 65% center !important; }}
        `}</style>

        <div className="page-content" style={{ padding: '4rem 1.5rem'}}>
          <div className="container">
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => goTo('home', 'contact')} className="btn btn-dark">
                {t('volunteer.btn_write')}
              </button>
              <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>
                {t('volunteer.btn2')}
              </button>
            </div>

            <h2>{t('volunteer.what_title')}</h2>
            <p>{t('volunteer.what_p1')}</p>
            <p>{t('volunteer.what_p2')}</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '6px',
              margin: '2rem 0 2.5rem',
            }}>
              {VOL_PHOTO_SRCS.map((src, i) => (
                  <div
                      key={i}
                      style={{
                        height: '250px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: '6px'
                      }}
                      onClick={() => setLbIdx(i)}
                  >
                    <img
                        src={src}
                        alt={photoCaps[i]}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.4s',
                          filter: 'brightness(0.88)',
                        }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.filter = 'brightness(1)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.filter = 'brightness(0.88)'; }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '0.5rem 0.8rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      pointerEvents: 'none',
                    }}>{photoCaps[i]}</div>
                  </div>
              ))}
            </div>

            {lbIdx !== null && (
                <Lightbox srcs={VOL_PHOTO_SRCS} captions={photoCaps} idx={lbIdx} setIdx={setLbIdx} />
            )}

            <div className="highlight">
              <p>{t('volunteer.highlight')}</p>
            </div>

            <h2>{t('volunteer.daily_title')}</h2>
            <div className="vol-tasks" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem 2rem', margin: '1.5rem 0 2.5rem' }}>
              {tasks.map(task => (
                  <div key={task} className="vol-task">{task}</div>
              ))}
            </div>

            <h2>{t('volunteer.schedule_title')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: '1.5rem 0 2.5rem', borderLeft: '2px solid #EDE5D8' }}>
              {schedule.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '1.2rem 0 1.2rem 2rem' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}>{s.time}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--dark)' }}>{s.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.55', fontWeight: 300 }}>{s.desc}</div>
                    </div>
                  </div>
              ))}
            </div>

            <h2>{t('volunteer.apply_title')}</h2>
            <p>
              {t('volunteer.apply_text').split('kim@novaslegacy.co.za')[0]}
              <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)' }}>kim@novaslegacy.co.za</a>
              {t('volunteer.apply_text').split('kim@novaslegacy.co.za')[1].split('+27 82 352 0940')[0]}
              <a href="tel:+27823520940" style={{ color: 'var(--gold)' }}>+27 82 352 0940</a>
              {t('volunteer.apply_text').split('+27 82 352 0940')[1]}
            </p>
          </div>
        </div>
      </>
  )
}

export default Volunteer