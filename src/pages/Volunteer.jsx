const SCHEDULE = [
  { time: '06:00', title: 'Alba nel Bush', desc: 'Sveglia con i suoni della savana. Preparazione del cibo e degli arricchimenti per tutti gli animali.' },
  { time: '07:00', title: 'Alimentazione', desc: 'Dai da mangiare a ghepardi, cani selvatici, caracal e tutti gli ospiti della riserva. Impara le loro personalità.' },
  { time: '09:00', title: 'Lavoro agli Enclosure', desc: 'Manutenzione, pulizia e miglioramento degli habitat. Lavoro fisico con uno scopo preciso.' },
  { time: '12:00', title: 'Pranzo & Riposo', desc: 'Pasto condiviso con vista sulle montagne del Waterberg. Un momento di comunità.' },
  { time: '14:00', title: 'Attività Pomeridiane', desc: 'Sessioni educative, arricchimenti, progetto cavalli, o game drives nella riserva.' },
  { time: '17:00', title: 'Pasto Serale & Tramonto', desc: 'Ultimi giri, cena insieme, e i tramonti più spettacolari che tu abbia mai visto.' },
]

const B = 'https://novaslegacy.com/wp-content/uploads/2022/08/'

const VOL_PHOTOS = [
  { src: B + 'IMG-20210830-WA0148-1.jpg',      cap: 'Cura degli animali' },
  { src: B + 'IMG_20200605_110224_811.jpg',     cap: 'Lavoro quotidiano' },
  { src: B + 'IMG-20210312-WA0032.jpg',         cap: 'Con i ghepardi' },
  { src: B + 'IMG_20200927_132938_928.jpg',     cap: 'Nel bush' },
  { src: B + '20210906_112700-scaled.jpg',      cap: 'Alimentazione' },
  { src: B + 'IMG-20210203-WA0023.jpg',         cap: 'Team in azione' },
]

const TASKS = [
  'Cura e alimentazione quotidiana degli animali',
  'Pulizia e manutenzione degli enclosure',
  'Costruzione di arricchimenti ambientali',
  'Progetto cavalli e equitazione',
  'Game drives e monitoraggio della riserva',
  'Attività educative e outreach',
  'Manutenzione generale della fattoria',
  'Raccolta dati scientifici',
]

function Volunteer({ goTo }) {
  return (
      <>
        <div className="page-hero-img">
          <img
              src="https://novaslegacy.com/wp-content/uploads/2022/08/IMG-20210830-WA0148-1.jpg"
              alt="Volontari a Nova's Legacy"
          />
          <div className="page-hero-img-overlay" />
          <div className="page-hero-text">
            <span className="label label-light">~ Join the Coalition ~</span>
            <h1>Vivi la <em>Conservazione</em></h1>
            <p>
              Non una vacanza con gli animali. Un lavoro vero, accanto a un team appassionato,
              in uno dei luoghi più belli del Sudafrica.
            </p>
          </div>
        </div>

        <div className="page-content">
          <div className="container">
            <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

            <h2>Cosa <em>significa</em> fare volontariato qui</h2>
            <p>
              Il volontariato a Nova&apos;s Legacy non è un&apos;esperienza turistica.
              È un lavoro vero: ti alzerai presto, lavorerai sodo, ti sporcherai le mani
              e ti addormenterai con i suoni del bush africano. Ogni giorno avrai
              un impatto diretto sulla vita degli animali che curiamo.
            </p>
            <p>
              In cambio ricevi: alloggio nel bush (chalet o tenda, secondo disponibilità),
              tre pasti al giorno cucinati in comune, mentoring del team professionale
              e la soddisfazione di fare qualcosa che conta davvero.
            </p>

            <div className="programs-grid" style={{ display: 'grid', gap: '5px', margin: '2rem 0 2.5rem' }}>
              {VOL_PHOTOS.map((p, i) => (
                  <div
                      key={i}
                      style={{
                        height: i < 3 ? '200px' : '160px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                  >
                    <img
                        src={p.src}
                        alt={p.cap}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.4s',
                          filter: 'brightness(0.88)',
                        }}
                        onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.filter = 'brightness(1)'; }}
                        onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.filter = 'brightness(0.88)'; }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '0.5rem 0.8rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      pointerEvents: 'none',
                    }}>{p.cap}</div>
                  </div>
              ))}
            </div>

            <div className="highlight">
              <p>
                <strong>Durata minima: 2 settimane.</strong> Il tempo ideale è 4–8 settimane —
                abbastanza per diventare parte del team e vedere i progressi veri degli animali.
                Soggiorno più lungo? Contattaci, troviamo una solutione.
              </p>
            </div>

            <h2>Cosa <em>farai</em> ogni giorno</h2>
            <div className="vol-tasks" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.6rem 2rem', margin: '1.5rem 0 2.5rem' }}>
              {TASKS.map(t => (
                  <div key={t} className="vol-task">{t}</div>
              ))}
            </div>

            <h2>La tua <em>giornata tipo</em></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: '1.5rem 0 2.5rem', borderLeft: '2px solid #EDE5D8' }}>
              {SCHEDULE.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '1.2rem 0 1.2rem 2rem' }}>
                    <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}>{s.time}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--dark)' }}>{s.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.55', fontWeight: 300 }}>{s.desc}</div>
                    </div>
                  </div>
              ))}
            </div>

            <h2>Come <em>candidarsi</em></h2>
            <p>
              Scrivici una email a <a href="mailto:kim@novaslegacy.co.za" style={{ color: 'var(--gold)' }}>kim@novaslegacy.co.za</a> o
              manda un messaggio WhatsApp al <a href="tel:+27823520940" style={{ color: 'var(--gold)' }}>+27 82 352 0940</a>.
              Presentati, raccontaci dei tuoi interessi e indicaci le date preferite.
              Ti risponderemo con disponibilità, prezzi e un information pack completo.
            </p>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
                Scrivici ora
              </a>
              <button className="btn btn-outline-dark" onClick={() => goTo('internship')}>
                Vedi anche: Internship
              </button>
            </div>
          </div>
        </div>
      </>
  )
}

export default Volunteer