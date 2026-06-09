const CHALETS = [
  {
    name: 'Chalet Nova',
    size: 'Per 2 persone',
    desc: 'Il chalet principale, dedicato alla nostra fondatrice. Vista sugli enclosure dei ghepardi. Camera matrimoniale, bagno privato, cucina attrezzata.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/vol-4-1024x768.jpg',
  },
  {
    name: 'Chalet Bush',
    size: 'Per 2–4 persone',
    desc: 'Immerso nella vegetazione del Waterberg. Letti twin o matrimoniale, spazio esterno privato, braai (barbecue africano) incluso.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-42.jpg',
  },
  {
    name: 'Chalet Waterberg',
    size: 'Per 2–4 persone',
    desc: 'Il più panoramico. Terrazza con vista sulle montagne, perfetto per famiglie o coppie che cercano privacy assoluta nella natura.',
    img: 'https://novaslegacy.com/wp-content/uploads/2022/05/Gallery-41.jpg',
  },
]

function Visit({ goTo }) {
  return (
      <>
        <div className="page-hero-img">
          <img
              src="https://novaslegacy.com/wp-content/uploads/2022/05/vol-4-1024x768.jpg"
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

            <div className="chalets-grid">
              {CHALETS.map(c => (
                  <div key={c.name} className="chalet-card">
                    <div className="chalet-img-wrapper">
                      <img src={c.img} alt={c.name} />
                    </div>
                    <div className="chalet-info">
                      <div className="chalet-size">{c.size}</div>
                      <h3 className="chalet-title">{c.name}</h3>
                      <p className="chalet-desc">{c.desc}</p>
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

        <style>{`
        .chalets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin: 2rem 0 3rem;
        }

        .chalet-card {
          border: 1px solid #EDE5D8;
          border-radius: 4px;
          overflow: hidden;
          background: var(--off-white, #fbfaf8);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .chalet-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        }

        .chalet-img-wrapper {
          height: 220px;
          overflow: hidden;
          width: 100%;
        }

        .chalet-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .chalet-card:hover .chalet-img-wrapper img {
          transform: scale(1.03);
        }

        .chalet-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .chalet-size {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold, #d4af37);
          margin-bottom: 0.4rem;
          font-weight: 600;
        }

        .chalet-title {
          font-family: var(--serif);
          font-size: 1.3rem;
          margin-bottom: 0.6rem;
          color: var(--dark, #222222);
          font-weight: 600;
        }

        .chalet-desc {
          font-size: 0.88rem;
          color: #666666;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 992px) {
          .chalets-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem;
          }
        }

        @media (max-width: 600px) {
          .challets-grid,
          .chalets-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .chalet-img-wrapper {
            height: 200px;
          }
        }
      `}</style>
      </>
  )
}

export default Visit