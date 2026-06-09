const ANIMALS = [
  {
    emoji: '🐆',
    name: 'Nova',
    species: 'Gheparda',
    price: 'Da €15/mese',
    desc: 'Quella che ha dato inizio a tutto. Tre zampe, cuore immenso. La tua adozione sostiene l\'intero programma di riproduzione.',
    img: '/img/nova-primo-piano.png',
  },
  {
    emoji: '🦁',
    name: 'Shira',
    species: 'Leonessa',
    price: 'Da €20/mese',
    desc: 'Salvata da cucciola, Shira è cresciuta in una magnifica leonessa. La tua adozione la tiene al sicuro ogni giorno.',
    img: '/img/leone-adulto.png',
  },
  {
    emoji: '🐕',
    name: 'Ghost Pack',
    species: 'Cani Selvatici Africani',
    price: 'Da €25/mese',
    desc: 'I cani dipinti sono tra gli animali più minacciati dell\'Africa. Adotta il branco e aiutaci a mantenerlo unito.',
    img: '/img/licaone.png',
  },
  {
    emoji: '🐎',
    name: 'Spirit',
    species: 'Cavallo',
    price: 'Da €10/mese',
    desc: 'Salvato dall\'abbandono, Spirit è la prova vivente che le seconde possibilità funzionano.',
    img: '/img/cavallo-puledro.png',
  },
  {
    emoji: '🦊',
    name: 'Sandy',
    species: 'Volpe dalle Orecchie a Pipistrello',
    price: 'Da €8/mese',
    desc: 'Piccola, curiosa e piena di personalità. Sandy ha bisogno di cure quotidiane e del tuo sostegno.',
    img: '/img/volpe-orecchie.png',
  },
  {
    emoji: '🐱',
    name: 'Shadow',
    species: 'Serval',
    price: 'Da €12/mese',
    desc: 'Cacciatore notturno con il manto dorato e un udito straordinario. Tranquillo ma indimenticabile.',
    img: '/img/serval.png',
  },
]

function Adopt({ goTo }) {
  return (
    <>
      <div className="page-hero-img">
        <img
          src="/img/ghepardo-cucciolo.png"
          alt="Adotta un animale"
        />
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
            Con l&apos;adozione simbolica ricevi: un certificato ufficiale con la foto e la storia
            dell&apos;animale adottato, aggiornamenti mensili via email, e la certezza che
            il tuo contributo arriva direttamente alle cure quotidiane.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}>
            {ANIMALS.map(a => (
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
                  <img src={a.img} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.3rem' }}>{a.species}</div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>{a.name}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#777', lineHeight: '1.65', fontWeight: 300, marginBottom: '1.2rem' }}>{a.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)' }}>{a.price}</span>
                    <a
                      href="mailto:kim@novaslegacy.co.za"
                      className="btn btn-dark btn-sm"
                    >
                      Adotta
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="highlight" style={{ marginTop: '3rem' }}>
            <p>
              Per adottare scrivi a <strong>kim@novaslegacy.co.za</strong> indicando l&apos;animale scelto.
              Ti risponderemo entro 48 ore con le istruzioni per il pagamento e il tuo certificato di adozione personalizzato.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Adopt
