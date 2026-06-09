const CHALETS = [
  {
    name: 'Chalet Nova',
    size: 'Per 2 persone',
    desc: 'Il chalet principale, dedicato alla nostra fondatrice. Vista sugli enclosure dei ghepardi. Camera matrimoniale, bagno privato, cucina attrezzata.',
    img: '/img/chalet-esterno.png',
  },
  {
    name: 'Chalet Bush',
    size: 'Per 2–4 persone',
    desc: 'Immerso nella vegetazione del Waterberg. Letti twin o matrimoniale, spazio esterno privato, braai (barbecue africano) incluso.',
    img: '/img/chalet-esterno-2.png',
  },
  {
    name: 'Chalet Waterberg',
    size: 'Per 2–4 persone',
    desc: 'Il più panoramico. Terrazza con vista sulle montagne, perfetto per famiglie o coppie che cercano privacy assoluta nella natura.',
    img: '/img/chalet-camera.png',
  },
]

function Visit({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="/img/chalet-esterno.png"
          alt="Soggiorno a Nova's Legacy"
        />
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Soggiorno &amp; Visite ~</span>
          <h1>Dormire nel <em>Bush Africano</em></h1>
          <p>
            Tre chalet self-catering immersi nel Waterberg.
            Colazione inclusa, animali selvatici a portata di sguardo,
            e un silenzio che non trovi in nessun altro posto al mondo.
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Tre chalet, <em>un&apos;esperienza unica</em></h2>
          <p>
            I nostri chalet self-catering sono progettati per chi vuole vivere
            l&apos;Africa autentica senza rinunciare al comfort. Ogni chalet è dotato
            di cucina attrezzata, bagno privato, acqua calda e WiFi.
            La colazione è inclusa nel prezzo ogni mattina.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '2rem 0 3rem' }}>
            {CHALETS.map(c => (
              <div key={c.name} style={{ border: '1px solid #EDE5D8', overflow: 'hidden', background: 'var(--off-white)' }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.4rem' }}>{c.size}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', marginBottom: '0.6rem', color: 'var(--dark)' }}>{c.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.65', fontWeight: 300 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>Come <em>arrivare</em></h2>
          <p>
            Siamo a circa 130 km a nord di Pretoria, nel distretto di Bela-Bela (Warmbaths),
            Limpopo. L&apos;indirizzo esatto è: <strong>431 Diepdrift, Bela-Bela, 0480, South Africa</strong>.
          </p>
          <p>
            L&apos;aeroporto più vicino è OR Tambo (Johannesburg), a circa 2 ore di guida.
            Possiamo organizzare un transfer su richiesta (costo aggiuntivo).
            Per i percorsi da seguire una volta in zona, ti mandiamo le istruzioni precise al momento della prenotazione.
          </p>

          <div className="highlight">
            <p>
              <strong>Periodi consigliati:</strong> aprile–ottobre (stagione secca, temperatura ideale,
              animali più visibili). L&apos;estate (nov–mar) è calda e piovosa ma ugualmente magica.
              Il Waterberg è una destinazione tutto l&apos;anno.
            </p>
          </div>

          <h2>Aggiungi il <em>Cheetah Run</em></h2>
          <p>
            Tutti gli ospiti degli chalet possono prenotare il Cheetah Run durante il soggiorno.
            È l&apos;esperienza che rende una vacanza un ricordo per tutta la vita.
            Disponibile nei giorni feriali, mattina o pomeriggio.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              Prenota ora
            </a>
            <button className="btn btn-outline-dark" onClick={() => goTo('cheetah')}>
              Scopri il Cheetah Run
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Visit
