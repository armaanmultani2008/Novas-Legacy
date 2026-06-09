import { useState, useEffect } from 'react'

const SLIDE_IMGS = [
  '/img/ghepardo-corsa.png',
  '/img/ghepardo-corsa-2.png',
  '/img/ghepardo-corsa-3.png',
  '/img/ghepardo-corsa-erba-gialla.png',
  '/img/ghepardo-corsa-recinzione.png',
]

function CheetahRun({ goTo }) {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDE_IMGS.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <div className="page-hero-img" style={{ position: 'relative', overflow: 'hidden' }}>
        {SLIDE_IMGS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Cheetah Run"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 0.9s ease-in-out',
            }}
          />
        ))}
        <div className="page-hero-img-overlay" />
        <div className="page-hero-text">
          <span className="label label-light">~ Esperienza Unica ~</span>
          <h1>Cheetah <em>Run</em></h1>
          <p>
            Corri accanto al ghepardo più veloce del mondo.
            Un&apos;esperienza che dura pochi secondi ma rimane per sempre.
          </p>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 10,
        }}>
          {SLIDE_IMGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === slide ? 'var(--gold)' : 'rgba(255,255,255,0.45)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <span className="back-btn" onClick={() => goTo('home')}>← Torna alla Home</span>

          <h2>Il <em>Cheetah Run</em></h2>
          <p>
            Il Cheetah Run è l&apos;esperienza più adrenalinica che puoi fare a Nova&apos;s Legacy.
            Corri su una pista di 60 metri accanto a un ghepardo vivo, senti la sua
            accelerazione esplosiva, guardalo toccare i 112 km/h. Non è uno spettacolo —
            è una finestra sulla natura che ti cambia per sempre.
          </p>

          <div className="highlight">
            <p>
              <strong>Il ghepardo è l&apos;animale terrestre più veloce del pianeta.</strong>
              In soli tre secondi accelera da 0 a 96 km/h. Le sue zampe toccano terra
              solo per metà del tempo di corsa — per l&apos;altra metà, vola letteralmente.
            </p>
          </div>

          <h2>Come <em>funziona</em></h2>
          <p>
            L&apos;esperienza si svolge in un&apos;area dedicata all&apos;interno della riserva.
            Un ghepardo adulto, abituato alla presenza umana, viene portato nella zona
            di partenza. Al segnale, l&apos;animale inizia a correre seguendo uno stimolo visivo —
            e tu corri con lui. La distanza è di 60 metri: abbastanza per sentire il vento,
            abbastanza per non dimenticare mai.
          </p>
          <p>
            Disponibile per visitatori, gruppi e volontari. Durata totale circa
            15–20 minuti incluso il briefing di sicurezza.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', margin: '2.5rem 0' }}>
            {[
              { num: '112', unit: ' km/h', label: 'Velocità massima del ghepardo' },
              { num: '3',   unit: ' sec',  label: 'Per passare da 0 a 96 km/h' },
              { num: '60',  unit: ' m',    label: 'La pista del Cheetah Run' },
              { num: '7',   unit: ' m',    label: 'Falcata massima durante la corsa' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--dark)',
                color: 'white',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '2.6rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: '1rem', fontWeight: 400 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.5rem', color: 'rgba(255,255,255,0.6)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '2.5rem 0' }}>
            {[
              { src: '/img/ghepardo-corsa-erba-gialla.png', cap: 'La velocità del ghepardo' },
              { src: '/img/volontarie-ghepardo.png',        cap: "L'emozione dell'incontro" },
            ].map((p, i) => (
              <div key={i} style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img src={p.src} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'none'} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '0.8rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', pointerEvents: 'none' }}>{p.cap}</div>
              </div>
            ))}
          </div>

          <h2>Cose <em>pratiche</em></h2>
          <p>
            Indossa scarpe da corsa e abbigliamento comodo. Porta la macchina fotografica —
            ma assicurati che sia al sicuro con una cinghia o in un marsupio.
            Età minima: 12 anni. Non è richiesta esperienza atletica particolare:
            l&apos;importante è essere in forma per una corsa breve e intensa.
          </p>

          <div className="highlight">
            <p>
              Per prenotare scrivi a <strong>kim@novaslegacy.co.za</strong> o
              chiama il <strong>+27 82 352 0940</strong>.
              Disponibile tutti i giorni, mattina e pomeriggio, su prenotazione.
              Si consiglia di prenotare con almeno 48 ore di anticipo.
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="mailto:kim@novaslegacy.co.za" className="btn btn-dark">
              Prenota ora
            </a>
            <button className="btn btn-outline-dark" onClick={() => goTo('nova-story')}>
              La storia di Nova →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheetahRun
