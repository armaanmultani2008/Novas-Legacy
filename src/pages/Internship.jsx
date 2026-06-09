import { useScrollReveal } from '../hooks/useScrollReveal.js'

const FIELDS = [
  { sym: '◆', label: 'Biologia della Fauna Selvatica',   img: '/img/ghepardo-erba.png' },
  { sym: '◆', label: 'Medicina Veterinaria',              img: '/img/ghepardo-visita-vet.png' },
  { sym: '◆', label: 'Ecologia e Conservazione',         img: '/img/due-ghepardi.png' },
  { sym: '◆', label: 'Gestione delle Risorse Naturali',  img: '/img/volontario-recinzione.png' },
  { sym: '◆', label: 'Fotografia Naturalistica',          img: '/img/volpe-orecchie.png' },
  { sym: '◆', label: 'Genetica della Conservazione',     img: '/img/nova-madre-cucciolo.png' },
]

const PHOTOS = [
  '/img/ghepardo-visita-vet.png',
  '/img/volontarie-ghepardo.png',
  '/img/volontario-recinzione.png',
  '/img/volontari-lavoro.png',
]

function Internship({ goTo }) {
  useScrollReveal()
  return (
    <>
      <div className="page-hero-img">
        <img
          src="/img/volontari-gruppo.png"
          alt="Internship Nova's Legacy"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Formazione Accademica ~</span>
          <h1>Internship <em>Universitario</em></h1>
          <p>
            Esperienza pratica di conservazione per studenti di veterinaria,
            zoologia, ecologia e gestione della fauna selvatica.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Impara <em>sul campo</em></h2>
          <p>
            L&apos;internship a Nova&apos;s Legacy è progettato per studenti universitari
            che vogliono trasformare la teoria in pratica reale. Non simulate,
            non osservazione passiva — lavori direttamente con gli animali,
            sotto la supervisione di professionisti esperti.
          </p>
          <p>
            Ogni tirocinante segue un programma personalizzato in base al suo
            percorso accademico e agli obiettivi formativi concordati con l&apos;università.
            Forniamo documentazione ufficiale per il riconoscimento dei crediti formativi.
          </p>

          {/* Photo strip */}
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
                }}
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
            <p>
              Nova&apos;s Legacy collabora con università sudafricane, europee e americane.
              Se la tua università non ha ancora un accordo formale con noi,
              contattaci: lavoriamo per trovare una soluzione caso per caso.
            </p>
          </div>

          <h2>Aree di <em>specializzazione</em></h2>

          {/* Fields with images */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            margin: '1.5rem 0 2.5rem',
          }}>
            {FIELDS.map((f, i) => (
              <div
                key={f.label}
                className="rv"
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid #EDE5D8',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  transitionDelay: `${i * 0.07}s`,
                }}
              >
                <div style={{ height: '130px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={f.img}
                    alt={f.label}
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
                  <span style={{ color: 'var(--gold)', fontSize: '0.6rem', flexShrink: 0 }}>{f.sym}</span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--dark)', lineHeight: 1.4 }}>{f.label}</span>
                </div>
              </div>
            ))}
          </div>

          <h2>Cosa <em>include</em></h2>
          <p>
            L&apos;internship include: alloggio nella riserva (chalet o sistemazione condivisa),
            tre pasti al giorno, accesso a tutti i settori della riserva, partecipazione
            alle riunioni operative, supporto nella raccolta dati per tesi o ricerche,
            mentoring diretto di Kim Hiltrop e del team veterinario.
          </p>

          <h2>Durata e <em>costi</em></h2>
          <p>
            Durata minima: 4 settimane. Raccomandata: 8–12 settimane.
            Il costo del programma copre alloggio, pasti e supervisione.
            Scrivici per ricevere il preventivo dettagliato in base alla durata scelta.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              Candidati ora
            </a>
            <button className="btn btn-outline-dark" onClick={() => goTo('volunteer')}>
              Vedi anche: Volontariato
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Internship
