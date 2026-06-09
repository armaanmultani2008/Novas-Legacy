import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const ANIMALS = [
  {
    symbol: '◆',
    name: 'Nova',
    species: 'Gheparda',
    price: 15,
    desc: 'Quella che ha dato inizio a tutto. Tre zampe, cuore immenso. La tua adozione sostiene l\'intero programma di riproduzione.',
    img: '/img/nova-primo-piano.png',
  },
  {
    symbol: '◆',
    name: 'Shira',
    species: 'Leonessa',
    price: 20,
    desc: 'Salvata da cucciola, Shira è cresciuta in una magnifica leonessa. La tua adozione la tiene al sicuro ogni giorno.',
    img: '/img/leone-adulto.png',
  },
  {
    symbol: '◆',
    name: 'Ghost Pack',
    species: 'Cani Selvatici Africani',
    price: 25,
    desc: 'I cani dipinti sono tra gli animali più minacciati dell\'Africa. Adotta il branco e aiutaci a mantenerlo unito.',
    img: '/img/licaone.png',
  },
  {
    symbol: '◆',
    name: 'Spirit',
    species: 'Cavallo',
    price: 10,
    desc: 'Salvato dall\'abbandono, Spirit è la prova vivente che le seconde possibilità funzionano.',
    img: '/img/cavallo-puledro.png',
  },
  {
    symbol: '◆',
    name: 'Sandy',
    species: 'Volpe dalle Orecchie a Pipistrello',
    price: 8,
    desc: 'Piccola, curiosa e piena di personalità. Sandy ha bisogno di cure quotidiane e del tuo sostegno.',
    img: '/img/volpe-orecchie.png',
  },
  {
    symbol: '◆',
    name: 'Shadow',
    species: 'Serval',
    price: 12,
    desc: 'Cacciatore notturno con il manto dorato e un udito straordinario. Tranquillo ma indimenticabile.',
    img: '/img/serval.png',
  },
]

function Adopt({ goTo }) {
  const [loading, setLoading] = useState(null)
  const [portalEmail, setPortalEmail] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)

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
          <span className="label label-light">~ Adozione Simbolica ~</span>
          <h1>Adotta un <em>Animale</em></h1>
          <p>
            Non puoi venire fisicamente? Puoi comunque fare la differenza.
            Adotta simbolicamente uno dei nostri animali e ricevi aggiornamenti diretti.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <p style={{ fontSize: '1rem', lineHeight: '1.85', color: '#555', fontWeight: 300, maxWidth: '680px', marginBottom: '2.5rem' }}>
            Con l&apos;adozione simbolica ricevi: un <strong>certificato ufficiale</strong> con la foto e la storia
            dell&apos;animale adottato, <strong>aggiornamenti mensili via email</strong>, e la certezza che
            il tuo contributo arriva direttamente alle cure quotidiane.
            Puoi disdire in qualsiasi momento.
          </p>

          {/* ── Griglia animali ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {ANIMALS.map(a => (
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
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{a.species}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{a.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1.4rem' }}>{a.desc}</p>
                  <button
                    className="btn btn-dark btn-sm"
                    style={{ width: '100%', opacity: loading === a.name ? 0.6 : 1 }}
                    onClick={() => handleAdopt(a)}
                    disabled={loading === a.name}
                  >
                    {loading === a.name ? 'Caricamento...' : `Adotta ${a.name} — €${a.price}/mese`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Cosa include ── */}
          <div className="highlight" style={{ marginTop: '3rem' }}>
            <p>
              <strong>Cosa ricevi:</strong> certificato digitale personalizzato ◆ aggiornamenti mensili
              con foto e video ◆ accesso prioritario alle notizie dalla riserva ◆ possibilità
              di dedicare l&apos;adozione a qualcuno come regalo.
            </p>
          </div>

          {/* ── Gestisci abbonamento ── */}
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
