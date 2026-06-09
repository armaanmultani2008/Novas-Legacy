function NovaStory({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img src="/img/nova-primo-piano.png" alt="Nova — la gheparda fondatrice" />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ La Fondatrice ~</span>
          <h1>La Storia di <em>Nova</em></h1>
          <p>
            Nata da un accoppiamento responsabile tra ghepardi non consanguinei,
            Nova è diventata il simbolo di una missione che va ben oltre la singola vita.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Le origini di <em>Nova</em></h2>
          <p>
            Nova non è nata per caso. È il risultato di un&apos;unione scientificamente
            pianificata tra due ghepardi senza alcun legame di sangue — una scelta precisa,
            basata sull&apos;analisi genetica, con un obiettivo chiaro: preservare ciò che
            rimane della diversità genetica di una specie già gravemente compromessa.
          </p>
          <p>
            I suoi genitori furono selezionati tra gli esemplari disponibili proprio perché
            non condividevano alcuna linea di discendenza comune. Questo tipo di accoppiamento
            — chiamato <em>outbreeding</em> — è la pratica fondamentale di Nova&apos;s Legacy
            per combattere la consanguineità nei ghepardi in cattività.
          </p>

          <div className="highlight">
            <p>
              <strong>Nova è la prova che il metodo funziona.</strong>
              Sana, vivace, con un sistema immunitario forte e una vitalità straordinaria —
              ogni caratteristica che la contraddistingue è figlia di quella scelta genetica
              fatta prima ancora che nascesse.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            margin: '2.5rem 0',
          }}>
            {[
              { src: '/img/nova-primo-piano.png',      cap: 'Nova — il suo sguardo' },
              { src: '/img/nova-madre-cucciolo.png',   cap: 'Il futuro della specie' },
              { src: '/img/ghepardo-erba.png',         cap: 'Nova nella riserva' },
              { src: '/img/due-ghepardi.png',          cap: 'I ghepardi di Nova\'s Legacy' },
            ].map((p, i) => (
              <div key={i} style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={p.src}
                  alt={p.cap}
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
                }}>{p.cap}</div>
              </div>
            ))}
          </div>

          <h2>Perché la diversità genetica <em>è vitale</em></h2>
          <p>
            Circa 10.000 anni fa, un evento catastrofico — probabilmente una glaciazione —
            ha ridotto l&apos;intera popolazione mondiale di ghepardi a pochissimi individui.
            Da quel "collo di bottiglia" genetico, tutti i ghepardi viventi oggi discendono.
            Il risultato: il 99% del loro DNA è identico. Fratelli e individui non imparentati
            sono quasi indistinguibili a livello genetico.
          </p>
          <p>
            Le conseguenze pratiche sono gravi: sistema immunitario indebolito,
            fertilità maschile ridotta (oltre il 70% degli spermatozoi ha morfologia anomala),
            alta vulnerabilità alle malattie e ridotta resistenza agli stress ambientali.
            Accoppiare individui già geneticamente simili peggiora ulteriormente
            questa situazione.
          </p>
          <p>
            Per questo a Nova&apos;s Legacy ogni accoppiamento viene pianificato con cura.
            Vengono scelti solo esemplari senza alcun legame di sangue tra loro,
            spesso in coordinamento con riserve e zoo internazionali che partecipano
            allo stesso programma di conservazione genetica.
          </p>

          <h2>Il <em>Legacy</em> di Nova</h2>
          <p>
            La riserva porta il suo nome — non per nostalgia, ma per impegno.
            Nova rappresenta ciò che questo posto vuole essere ogni giorno:
            un luogo dove la scienza e la cura si incontrano, dove ogni nascita
            è una vittoria piccola ma reale contro l&apos;estinzione.
          </p>
          <p>
            Oggi Nova vive nella sua area della riserva, osservata e amata da centinaia
            di visitatori ogni anno. E ogni cucciolo che nasce a Nova&apos;s Legacy
            porta con sé lo stesso principio che l&apos;ha portata al mondo:
            genitori scelti per la loro distanza genetica, nessun legame di sangue,
            massima diversità possibile. È il suo lascito — il suo <em>Legacy</em>.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-dark" onClick={() => goTo('cheetah-run')}>
              Vivi il Cheetah Run
            </button>
            <button className="btn btn-outline-dark" onClick={() => goTo('adopt')}>
              Adotta un Ghepardo
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NovaStory
