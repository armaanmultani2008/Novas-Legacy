import { useTranslation } from 'react-i18next'

const ANIMAL_EMOJIS = ['🐆','🦁','🐕','🐎','🦊','🐱']
const ANIMAL_IMGS = [
  '/img/nova-primo-piano.png',
  '/img/leone-adulto.png',
  '/img/licaone.png',
  '/img/cavallo-puledro.png',
  '/img/volpe-orecchie.png',
  '/img/serval.png',
]

function Adopt({ goTo }) {
  const { t } = useTranslation()
  const animals = t('adopt.animals', { returnObjects: true })

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/ghepardo-cucciolo.png" alt="Adotta un animale" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('adopt.hero_label')}</span>
          <h1>{t('adopt.hero_title')}</h1>
          <p>{t('adopt.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#555', fontWeight: 300, maxWidth: '680px', marginBottom: '2.5rem' }}>
            {t('adopt.desc')}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {animals.map((a, i) => (
              <div
                key={a.name}
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid #EDE5D8',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={ANIMAL_IMGS[i]} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{a.species}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{a.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1.2rem' }}>{a.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)' }}>{a.price}</span>
                    <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark btn-sm">
                      {t('adopt.adopt_btn')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="highlight" style={{ marginTop: '3rem' }}>
            <p>{t('adopt.highlight')}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Adopt
