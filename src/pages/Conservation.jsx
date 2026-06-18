import { useTranslation } from 'react-i18next'
import { useCMSImages } from '../CMSContext'

function Conservation({ goTo }) {
  const { t } = useTranslation()
  const cmsImages = useCMSImages()

  return (
      <>
        <div className="page-hero-img" style={{
          height: '65dvh',
          minHeight: '450px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
            <source media="(max-width: 768px)" srcSet="/img/due-ghepardi.png" />

            <img
                src={cmsImages.conservation_hero || '/img/hero-cheetah-project.png'}
                alt="Conservazione"
                className="page-hero-img-photo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  display: 'block'
                }}
            />
          </picture>
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('conservation.hero_label')}</span>
            <h1>{t('conservation.hero_title').split(' ').slice(0,-1).join(' ')} <em>{t('conservation.hero_title').split(' ').slice(-1)}</em></h1>
            <p>{t('conservation.hero_sub')}</p>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .page-hero-img-photo { object-position: 40% center !important;} }
        `}</style>

        <div className="page-content" style={{ padding: '4rem 1.5rem' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto'}}>
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-dark" onClick={() => goTo('volunteer')}>{t('conservation.btn1')}</button>
              <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>{t('conservation.btn2')}</button>
            </div>

            <h2>{t('conservation.mission_title').split(' ').slice(0,-1).join(' ')} <em>{t('conservation.mission_title').split(' ').slice(-1)}</em></h2>
            <p>{t('conservation.mission_p')}</p>

            <div className="highlight">
              <p>{t('conservation.highlight')}</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '6px',
              margin: '2.5rem 0'
            }}>
              {[
                { src: '/img/cubs.png',    cap: 'Cubs' },
                { src: '/img/veterinary.jpg', cap: 'Veterinary monitoring' },
              ].map((p, i) => (
                  <div key={i} style={{ height: '320px', overflow: 'hidden', position: 'relative', borderRadius: '6px' }}>
                    <img src={p.src} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                         onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                         onMouseLeave={e => e.target.style.transform = 'none'} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>{p.cap}</div>
                  </div>
              ))}
            </div>

            <h2><em>{t('conservation.edu_title')}</em></h2>
            <p>{t('conservation.edu_p1')}</p>
            <p>{t('conservation.edu_p2')}</p>

            <h2><em>{t('conservation.science_title')}</em></h2>
            <p>{t('conservation.science_p')}</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '6px',
              margin: '2.5rem 0'
            }}>
              {[
                { src: '/img/volontari-gruppo.png',   cap: t('conservation.edu_title') },
                { src: '/img/man-cheetah.png', cap: 'Cheetah' },
              ].map((p, i) => (
                  <div key={i} style={{ height: '320px', overflow: 'hidden', position: 'relative', borderRadius: '6px' }}>
                    <img src={p.src} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                         onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                         onMouseLeave={e => e.target.style.transform = 'none'} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>{p.cap}</div>
                  </div>
              ))}
            </div>

            <h2><em>{t('conservation.coexist_title')}</em></h2>
            <p>{t('conservation.coexist_p')}</p>
          </div>
        </div>
      </>
  )
}

export default Conservation