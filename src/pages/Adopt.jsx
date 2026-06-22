import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUser } from '../UserContext'
import { useCMSImages } from '../CMSContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const FALLBACK_ANIMALS = [
  { id: '1', name: 'Storm',    species: 'Golden Tabby Tiger', price: 15, img: '/img/adopt-storm.png' },
  { id: '2', name: 'Guinness', species: 'King Cheetah',       price: 20, img: '/img/adopt-guinness.png' },
  { id: '3', name: 'Lyvia',    species: 'Cheetah',            price: 15, img: '/img/adopt-lyvia.png' },
  { id: '4', name: 'Oakley',   species: 'Cheetah',            price: 15, img: '/img/adopt-oakley.png' },
  { id: '5', name: 'Jagger',   species: 'Cheetah',            price: 12, img: '/img/adopt-jagger.png' },
]

function Adopt({ goTo }) {
  const { t } = useTranslation()
  const { user } = useUser()
  const cmsImages = useCMSImages()
  const [loading, setLoading] = useState(null)
  const [portalEmail, setPortalEmail] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)
  const [cmsAnimals, setCmsAnimals] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/cms`)
        .then(r => r.json())
        .then(d => {
          if (d.animals?.length) setCmsAnimals(d.animals)
        })
        .catch(() => {})
  }, [])

  const animals = cmsAnimals || FALLBACK_ANIMALS

  const handleAdopt = async (animal) => {
    setLoading(animal.name)
    try {
      const r = await fetch(`${API}/api/stripe/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalName: animal.name,
          animalSpecies: animal.species,
          price: animal.price,
          ...(user?._id ? { userId: user._id } : {}),
        }),
      })
      const data = await r.json()
      if (data.url) window.location.href = data.url
      else alert(t('common.error_checkout'))
    } catch {
      alert(t('common.error_backend'))
    }
    setLoading(null)
  }

  const handlePortal = async (e) => {
    e.preventDefault()
    setPortalLoading(true)
    setPortalError(null)
    try {
      const r = await fetch(`${API}/api/stripe/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: portalEmail }),
      })
      const data = await r.json()
      if (data.url) window.location.href = data.url
      else setPortalError(data.error || t('adopt.portal_error_not_found'))
    } catch {
      setPortalError(t('common.error_backend'))
    }
    setPortalLoading(false)
  }

  return (
      <>
        <div className="page-hero-img" style={{height: '75dvh'}}>
          <img src={cmsImages.adopt_hero || '/img/ghepardo-corsa-erba-gialla.png'} alt="Adotta un animale" style={{ objectPosition: 'center 40%' }} />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">{t('adopt.hero_label')}</span>
            <h1>{t('adopt.hero_title').split(' ').slice(0,-1).join(' ')} <em>{t('adopt.hero_title').split(' ').slice(-1)}</em></h1>
            <p>{t('adopt.hero_sub')}</p>
          </div>
        </div>

        <div className="page-content adopt-content">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

            <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#555', fontWeight: 300, marginBottom: '2.5rem' }}>
              {t('adopt.desc')}
            </p>

            <div className="page-grid-3" style={{ gap: '1.5rem' }}>
              {animals.map((a, i) => (
                  <div
                      key={a.id || a.name || i}
                      style={{
                        background: 'var(--off-white)',
                        border: '1px solid #EDE5D8',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                      <img
                          src={a.img || (FALLBACK_ANIMALS[i] ? FALLBACK_ANIMALS[i].img : FALLBACK_ANIMALS[0].img)}
                          alt={a.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 20%',
                          }}
                      />
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--gold)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.25rem 0.65rem', textTransform: 'uppercase' }}>
                        €{a.price}/{t('adopt.per_month')}
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{a.species}</div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{a.name}</h3>
                      <button
                          className="btn btn-dark btn-sm"
                          style={{ width: '100%', opacity: loading === a.name ? 0.6 : 1 }}
                          onClick={() => handleAdopt(a)}
                          disabled={loading === a.name}
                      >
                        {loading === a.name ? t('adopt.loading') : `${t('adopt.adopt_btn')} ${a.name} — €${a.price}/${t('adopt.per_month')}`}
                      </button>
                    </div>
                  </div>
              ))}
            </div>

            <div className="highlight" style={{ marginTop: '3rem' }}>
              <p>
                <strong>{t('adopt.what_you_get_title')}:</strong> {t('adopt.what_you_get_text')}
              </p>
            </div>

            <div className="portal-box">
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
                {t('adopt.portal_title')} <em>{t('adopt.portal_title_em')}</em>
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#777', marginBottom: '1.5rem', fontWeight: 300 }}>
                {t('adopt.portal_desc')}
              </p>
              <form onSubmit={handlePortal} className="portal-form">
                <input
                    type="email"
                    required
                    placeholder={t('adopt.portal_email_placeholder')}
                    value={portalEmail}
                    onChange={e => { setPortalEmail(e.target.value); setPortalError(null) }}
                    className="portal-input"
                    style={{
                      border: portalError ? '1px solid #c0392b' : '1px solid #C8880A',
                    }}
                />
                <button
                    type="submit"
                    className="btn btn-dark portal-btn"
                    disabled={portalLoading}
                    style={{ opacity: portalLoading ? 0.6 : 1 }}
                >
                  {portalLoading ? t('adopt.portal_loading') : t('adopt.portal_btn')}
                </button>
              </form>
              {portalError && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.84rem', color: '#c0392b' }}>{portalError}</p>
              )}
            </div>
          </div>
        </div>
      </>
  )
}

export default Adopt