function Horses({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="/img/cavallo-puledro.png"
          alt="Progetto Cavalli"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Rescue &amp; Riabilitazione ~</span>
          <h1>Il Progetto <em>Cavalli</em></h1>
          <p>
            Una seconda possibilità per cavalli salvati da situazioni difficili.
            Riabilitazione, cura e connessione umana.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Chi sono i <em>nostri cavalli</em></h2>
          <p>
            Il progetto cavalli di Nova&apos;s Legacy nasce dalla stessa filosofia
            che guida tutto il nostro lavoro: ogni animale merita rispetto, cura e
            la possibilità di vivere una vita dignitosa.
          </p>
          <p>
            I cavalli che ospitiamo provengono da situazioni di abbandono, maltrattamento
            o impossibilità di mantenimento. Vengono valutati da veterinari,
            trattati per eventuali problemi fisici e gradualmente riabilitati
            attraverso un programma di rieducazione relazionale.
          </p>

          <div className="highlight">
            <p>
              La riabilitazione equina è un processo lento che richiede pazienza,
              coerenza e rispetto. I volontari partecipano attivamente a questo percorso —
              imparando allo stesso tempo le basi dell&apos;equitazione e della comunicazione non verbale.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '2.5rem 0' }}>
            {[
              { src: '/img/volontario-recinzione.png', cap: 'Manutenzione quotidiana dei recinti' },
              { src: '/img/volontari-lavoro.png',      cap: 'Il team al lavoro nella riserva' },
            ].map((p, i) => (
              <div key={i} style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img src={p.src} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'none'} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>{p.cap}</div>
              </div>
            ))}
          </div>

          <h2>Cosa fanno i <em>volontari</em></h2>
          <p>
            I volontari che scelgono di lavorare con i cavalli seguono un programma
            specifico che include: pulizia e manutenzione delle stalle, somministrazione
            di pasti e integratori, sessioni di grooming, lavoro al longe e,
            per chi ha esperienza, sessioni di monta supervisionata.
          </p>
          <p>
            Non è necessaria esperienza pregressa con i cavalli. Il team insegna tutto
            dall&apos;inizio, in totale sicurezza. L&apos;importante è l&apos;atteggiamento giusto:
            calma, rispetto e apertura all&apos;apprendimento.
          </p>

          <div style={{ height: '320px', overflow: 'hidden', position: 'relative', margin: '2.5rem 0' }}>
            <img src="/img/ghepardo-erba.png" alt="La riserva nel Waterberg" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem 1.2rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>La riserva di Nova&apos;s Legacy — Waterberg, Limpopo</div>
          </div>

          <h2>Parte di un <em>ecosistema più grande</em></h2>
          <p>
            I cavalli di Nova&apos;s Legacy vivono nella stessa riserva di ghepardi,
            cani selvatici, giraffe e zebre. Questo crea un ambiente straordinariamente
            ricco, dove ogni mattina è una scoperta diversa.
          </p>
          <p>
            Molti volontari dicono che il momento più memorabile del loro soggiorno
            è stato vedere un ghepardo e un cavallo separati solo dalla recinzione,
            guardarsi con reciproca curiosità.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('volunteer')}>
              Fai Volontariato
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('conservation')}>
              Scopri la Conservazione
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Horses
