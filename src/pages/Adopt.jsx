import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const ANIMALS = [
  { name: 'Nova',       species: 'Gheparda',                    price: 15, img: '/img/nova-primo-piano.png'  },
  { name: 'Shira',      species: 'Leonessa',                    price: 20, img: '/img/leone-adulto.png'      },
  { name: 'Ghost Pack', species: 'Cani Selvatici Africani',     price: 25, img: '/img/licaone.png'           },
  { name: 'Spirit',     species: 'Cavallo',                     price: 10, img: '/img/cavallo-puledro.png'   },
  { name: 'Sandy',      species: 'Volpe dalle Orecchie a Pipistrello', price: 8, img: '/img/volpe-orecchie.png' },
  { name: 'Shadow',     species: 'Serval',                      price: 12, img: '/img/serval.png'            },
]

function Adopt({ goTo }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(null)
  const [portalEmail, setPortalEmail] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)

  const animals = t('adopt.animals', { returnObjects: true })

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
        }),
      })
      const data = await r.json()
      if (data.url) window.location.href = data.url
      else alert('Errore nel checkout. Riprova.')
    } catch {
      alert('Backend non raggiungibile. Assicurati che il server sia avviato.')
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
      else setPortalError(data.error || 'Nessun abbonamento trovato per questa email.')
    } catch {
      setPortalError('Backend non raggiungibile. Assicurati che il server sia avviato.')
    }
    setPortalLoading(false)
  }

  return (
    <>
      <div className="page-hero-img">
        <img src="/img/ghepardo-cucciolo.png" alt="Adotta un animale" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">{t('adopt.hero_label')}</span>
          <h1>{t('adopt.hero_title').split(' ').slice(0,-1).join(' ')} <em>{t('adopt.hero_title').split(' ').slice(-1)}</em></h1>
          <p>{t('adopt.hero_sub')}</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>{t('common.back_home')}</span>

          <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#555', fontWeight: 300, maxWidth: '680px', marginBottom: '2.5rem' }}>
            {t('adopt.desc')}
          </p>

          <div className="page-grid-3" style={{ gap: '1.5rem' }}>
            {ANIMALS.map((a, idx) => {
              const info = animals[idx] || {}
              return (
                <div
                  key={a.name}
                  style={{
                    background: 'var(--off-white)',
                    border: '1px solid #EDE5D8',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img src={a.img} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--gold)', color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.25rem 0.65rem', textTransform: 'uppercase' }}>
                      €{a.price}/mese
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{info.species || a.species}</div>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{a.name}</h3>
                    <p style={{ fontSize: '0.84rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1.4rem' }}>{info.desc || ''}</p>
                    <button
                      className="btn btn-dark btn-sm"
                      style={{ width: '100%', opacity: loading === a.name ? 0.6 : 1 }}
                      onClick={() => handleAdopt(a)}
                      disabled={loading === a.name}
                    >
                      {loading === a.name ? 'Caricamento...' : `${t('adopt.adopt_btn')} ${a.name} — €${a.price}/mese`}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="highlight" style={{ marginTop: '3rem' }}>
            <p>
              <strong>Cosa ricevi:</strong> certificato digitale personalizzato ◆ aggiornamenti mensili
              con foto e video ◆ accesso prioritario alle notizie dalla riserva ◆ possibilità
              di dedicare l&apos;adozione a qualcuno come regalo.
            </p>
          </div>

          <div style={{ marginTop: '4rem', padding: '2.5rem', background: '#F7F3EE', border: '1px solid #EDE5D8' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
              Gestisci il tuo <em>abbonamento</em>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#777', marginBottom: '1.5rem', fontWeight: 300 }}>
              Inserisci l&apos;email usata al momento dell&apos;adozione per accedere al portale
              dove puoi aggiornare la carta di pagamento, cambiare importo o disdire in qualsiasi momento.
            </p>
            <form onSubmit={handlePortal} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="La tua email di adozione"
                value={portalEmail}
                onChange={e => { setPortalEmail(e.target.value); setPortalError(null) }}
                style={{
                  flex: 1, minWidth: '240px', padding: '0.75rem 1rem',
                  border: portalError ? '1px solid #c0392b' : '1px solid #C8880A',
                  background: '#fff', fontSize: '0.9rem', fontFamily: 'var(--sans)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn btn-dark"
                disabled={portalLoading}
                style={{ opacity: portalLoading ? 0.6 : 1 }}
              >
                {portalLoading ? 'Caricamento...' : 'Accedi al portale →'}
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
