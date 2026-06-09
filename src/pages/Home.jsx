import { useEffect, useRef, useState } from 'react'

const IMG = {
  hero:        '/img/ghepardo-erba.png',
  pillar1:     '/img/nova-madre-cucciolo.png',
  pillar2:     '/img/volontari-gruppo.png',
  pillar3:     '/img/ghepardo-visita-vet.png',
  cheetahRun:  '/img/ghepardo-corsa-recinzione.png',
  progRun:     '/img/ghepardo-corsa-2.png',
  progVol:     '/img/volontari-lavoro.png',
  progChalet:  '/img/chalet-esterno.png',
  progInt:     '/img/volontari-gruppo.png',
  progAdopt:   '/img/ghepardo-cucciolo.png',
  progBreed:   '/img/nova-madre-cucciolo.png',
  vol1:        '/img/volontari-lavoro.png',
  vol2:        '/img/volontarie-ghepardo.png',
  vol3:        '/img/volontario-recinzione.png',
  vol4:        '/img/volontari-gruppo.png',
  bigCta:      '/img/ghepardo-corsa.png',
  accom:       '/img/chalet-esterno.png',
  accom2:      '/img/chalet-camera.png',
}

const GALLERY_IMGS = [
  { src: '/img/chalet-esterno.png',             caption: 'La Riserva' },
  { src: '/img/due-ghepardi.png',               caption: 'I Ghepardi' },
  { src: '/img/ghepardo-erba.png',              caption: 'Nel Bush' },
  { src: '/img/ghepardo-albero.png',            caption: 'Alba sul Waterberg' },
  { src: '/img/volpe-orecchie.png',             caption: 'Vita Selvatica' },
  { src: '/img/volontarie-ghepardo.png',        caption: 'I Volontari' },
  { src: '/img/volontario-recinzione.png',      caption: 'Mattina al Recinto' },
  { src: '/img/ghepardo-visita-vet.png',        caption: 'Cura Quotidiana' },
  { src: '/img/ghepardo-corsa-erba-gialla.png', caption: 'Tramonto' },
  { src: '/img/nova-primo-piano.png',           caption: 'Nova' },
]

const ANIMALS_MARQUEE = [
  { name: 'Nova',       role: 'Gheparda · La Fondatrice',          src: '/img/nova-primo-piano.png' },
  { name: 'Shira',      role: 'Leonessa · Salvata da cucciola',     src: '/img/leone-cucciolo-pneumatico.png' },
  { name: 'Ghost Pack', role: 'Cani Selvatici Africani',            src: '/img/licaone.png' },
  { name: 'Tumelo',     role: 'Giraffa · Libera nella Riserva',    src: '/img/ghepardo-erba-alta.png' },
  { name: 'Spirit',     role: 'Cavallo · Riabilitato',              src: '/img/cavallo-puledro.png' },
  { name: 'Sandy',      role: 'Volpe dalle Orecchie a Pipistrello', src: '/img/volpe-orecchie.png' },
  { name: 'Caracal',    role: 'Lince del Deserto',                  src: '/img/baby-wild.png' },
  { name: 'Serval',     role: 'Cacciatore Notturno',                src: '/img/serval.png' },
]

const PROGRAMS = [
  { tag: 'Esperienza',   title: 'Cheetah Run',         img: IMG.progRun,   page: 'cheetah-run',  desc: 'Corri 60 metri accanto al ghepardo più veloce del mondo. Un\'esperienza che dura secondi ma rimane per sempre.' },
  { tag: 'Volontariato', title: 'Join the Coalition',  img: IMG.progVol,   page: 'volunteer',    desc: 'Vitto, alloggio e un lavoro che conta. Lavora fianco a fianco con il team. Minimo 2 settimane.' },
  { tag: 'Soggiorno',    title: 'Chalet nel Bush',      img: IMG.progChalet,page: 'visit',        desc: 'Tre chalet indipendenti immersi nella natura. Cucina, WiFi, acqua calda. Svegliati coi ghepardi.' },
  { tag: 'Formazione',   title: 'Internship',           img: IMG.progInt,   page: 'internship',   desc: 'Stage universitari in veterinaria, ecologia, biologia. Documentazione accademica e mentoring professionale.' },
  { tag: 'Adozione',     title: 'Adotta un Animale',   img: IMG.progAdopt, page: 'adopt',        desc: 'Adotta simbolicamente uno dei nostri animali. Ricevi aggiornamenti mensili e il certificato ufficiale.' },
  { tag: 'Conservazione',title: 'Breeding Program',    img: IMG.progBreed, page: 'conservation', desc: 'Il programma di riproduzione contribuisce al gene pool globale. Collaboriamo con zoo e riserve internazionali.' },
]

const TESTIMONIALS = [
  {
    quote: 'Un\'esperienza che ha cambiato la mia prospettiva sulla vita. Vedere Nova correre libera è qualcosa che non dimenticherò mai.',
    name: 'Giulia M.', location: 'Milano, Italia', stars: 5,
  },
  {
    quote: 'Kim e il suo team sono incredibili. Ho imparato più in tre settimane qui che in un anno di università.',
    name: 'Thomas W.', location: 'Berlin, Germany', stars: 5,
  },
  {
    quote: 'Gli chalet sono confortevoli, il cibo ottimo. Ma la cosa più bella è svegliarsi a contatto con questi animali straordinari.',
    name: 'Ana R.', location: 'Madrid, Spain', stars: 5,
  },
]

// ── Hooks ──
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    const sel = '.reveal,.rv,.rv-left,.rv-right,.rv-scale,.rv-up'
    document.querySelectorAll(sel).forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}


function useCounter(target, active) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0
    const step = Math.ceil(target / 55)
    const t = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(t)
    }, 28)
    return () => clearInterval(t)
  }, [active, target])
  return val
}

function StatItem({ num, suffix, label }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const count = useCounter(num, active)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="hero-strip-item" ref={ref}>
      <div className="strip-num">{active ? count.toLocaleString('it-IT') : 0}{suffix}</div>
      <div className="strip-label">{label}</div>
    </div>
  )
}

// ── Component ──
function Home({ goTo }) {
  useScrollReveal()

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <img className="hero-img" src={IMG.hero} alt="Nova — la gheparda fondatrice" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-eyebrow">● Bela-Bela, Limpopo · South Africa</div>
          <h1>
            Salviamo i Ghepardi<br />
            dall&apos;<em>Estinzione</em>
          </h1>
          <p className="hero-sub">
            Nova&apos;s Legacy è un centro di allevamento e conservazione dei ghepardi
            nel cuore del Waterberg. Fondato da Kim Hiltrop per Nova —
            una gheparda a tre zampe allevata a mano.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-gold" onClick={() => goTo('volunteer')}>
              Diventa Volontario
            </button>
            <button className="btn btn-outline" onClick={() => goTo('nova-story')}>
              Scopri il Progetto
            </button>
          </div>
        </div>

        <div className="hero-strip">
          <StatItem num={7000} suffix="+"    label="Ghepardi rimasti al mondo" />
          <StatItem num={865}  suffix=" ha"  label="Riserva protetta" />
          <StatItem num={50}   suffix="+"    label="Animali ospitati" />
          <StatItem num={200}  suffix="+"    label="Volontari ogni anno" />
        </div>
      </section>

      {/* ── ALERT BAR ── */}
      <div className="alert-bar">
        <span className="alert-tag">⚠ Emergenza</span>
        <p>
          Meno di <strong>7.000 ghepardi</strong> vivono ancora allo stato selvatico.
          Negli ultimi 100 anni ne abbiamo persi il <strong>90%</strong>.
          Senza intervento, questa specie non sopravviverà.
        </p>
        <button className="btn btn-outline btn-sm" onClick={() => goTo('conservation')}>
          Scopri Come Aiutare →
        </button>
      </div>

      {/* ── WHAT WE DO ── */}
      <section className="what-we-do">
        <div className="top">
          <div>
            <span className="label rv">~ Il Nostro Lavoro ~</span>
            <h2 className="h2 rv rv-d1">Tre pilastri per <em>salvare una specie</em></h2>
          </div>
          <p className="body-lg rv rv-d2">
            Da oltre 11 anni lavoriamo su tre fronti: allevamento responsabile,
            educazione ambientale e riabilitazione animale. Ogni programma è progettato
            per massimizzare l&apos;impatto sulla sopravvivenza del ghepardo.
          </p>
        </div>

        <div className="pillars">
          <div className="pillar rv">
            <img src={IMG.pillar1} alt="Allevamento" />
            <div className="pillar-overlay">
              <div className="pillar-num">01</div>
              <h3>Breeding & Conservazione</h3>
              <p>Programma di riproduzione certificato che contribuisce al gene pool globale. Collaboriamo con riserve e zoo internazionali.</p>
              <span className="pillar-link" onClick={() => goTo('conservation')}>Scopri di più</span>
            </div>
          </div>
          <div className="pillar rv rv-d1">
            <img src={IMG.pillar2} alt="Educazione" />
            <div className="pillar-overlay">
              <div className="pillar-num">02</div>
              <h3>Educazione & Comunità</h3>
              <p>Portiamo studenti locali e internazionali a conoscere la wildlife. Ogni visita è un seme piantato per il futuro.</p>
              <span className="pillar-link" onClick={() => goTo('volunteer')}>Scopri di più</span>
            </div>
          </div>
          <div className="pillar rv rv-d2">
            <img src={IMG.pillar3} alt="Riabilitazione" />
            <div className="pillar-overlay">
              <div className="pillar-num">03</div>
              <h3>Riabilitazione Animale</h3>
              <p>Accogliamo animali feriti o orfani — ghepardi, cavalli, cani selvatici — e li curiamo per restituirli alla natura.</p>
              <span className="pillar-link" onClick={() => goTo('horses')}>Scopri di più</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHEETAH RUN ── */}
      <section className="cheetah-run">
        <div className="cheetah-run-img">
          <img src={IMG.cheetahRun} alt="Cheetah Run" />
        </div>
        <div className="cheetah-run-content">
          <span className="label label-light rv">~ Esperienza Unica ~</span>
          <h2 className="rv rv-d1">
            Il <em>Cheetah Run</em> —<br />correre accanto al re della velocità
          </h2>
          <p className="rv rv-d2">
            Il ghepardo è l&apos;animale terrestre più veloce del pianeta.
            Con il nostro Cheetah Run hai la possibilità di corrergli accanto
            su 60 metri di pista, sentire il rombo dei suoi passi,
            guardarlo accelerare fino a 112 km/h.
          </p>
          <div className="speed-badge rv rv-d3">
            <span className="num">112</span>
            <span className="txt">km/h<br />velocità massima<br />del ghepardo</span>
          </div>
          <button className="btn btn-gold rv rv-d4" onClick={() => goTo('cheetah-run')}>
            Prenota il Cheetah Run
          </button>
        </div>
      </section>

      {/* ── PROGRAMS GRID ── */}
      <section className="programs" id="programs">
        <span className="label rv">~ Come Partecipare ~</span>
        <h2 className="h2 rv rv-d1">Scegli il tuo modo di <em>fare la differenza</em></h2>

        <div className="programs-grid">
          {PROGRAMS.map((p, i) => (
            <div
              key={p.title}
              className={`program-card rv rv-d${Math.min(i + 1, 5)}`}
              onClick={() => goTo(p.page)}
            >
              <div className="program-img">
                <img src={p.img} alt={p.title} />
              </div>
              <div className="program-body">
                <div className="program-tag">{p.tag}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="program-link">Scopri di più →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="gallery-section" id="gallery">
        <div>
          <span className="label label-light rv">~ La Vita nel Bush ~</span>
          <h2 className="h2 h2-light rv rv-d1">Ogni giorno è un <em>momento unico</em></h2>
        </div>

        <div className="gallery-masonry">
          {GALLERY_IMGS.map((g, i) => (
            <div key={i} className="gm-item">
              <img src={g.src} alt={g.caption} loading="lazy" />
              <div className="gm-caption">{g.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VOLUNTEER ── */}
      <section className="volunteer-section" id="volunteer">
        {/* 2×2 photo grid — no rv class so always visible */}
        <div className="volunteer-img-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '3px' }}>
          {[IMG.vol1, IMG.vol2, IMG.vol3, IMG.vol4].map((src, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <img
                src={src}
                alt={`Volontari ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { e.target.style.transform = 'none' }}
              />
            </div>
          ))}
        </div>
        <div className="vol-content">
          <span className="label rv">~ Join the Coalition ~</span>
          <h2 className="h2 rv rv-d1">Vivi il bush. <em>Salva una specie.</em></h2>
          <p className="rv rv-d2">
            Il volontariato a Nova&apos;s Legacy non è un&apos;esperienza turistica —
            è un lavoro vero. Contribuirai alla cura quotidiana degli animali,
            alla manutenzione della riserva, all&apos;educazione dei visitatori.
          </p>
          <p className="rv rv-d2">
            In cambio: alloggio nel bush, tre pasti al giorno in comune,
            un team appassionato e la soddisfazione di fare qualcosa che conta davvero.
          </p>
          <div className="vol-tasks rv rv-d3">
            {['Cura e alimentazione animali','Pulizia enclosure','Arricchimento ambientale','Manutenzione strutture','Educazione visitatori','Game drives','Raccolta dati scientifici','Progetto cavalli'].map(t => (
              <div key={t} className="vol-task">{t}</div>
            ))}
          </div>
          <button className="btn btn-dark rv rv-d4" onClick={() => goTo('volunteer')}>
            Candidati come Volontario
          </button>
        </div>
      </section>

      {/* ── ANIMALS MARQUEE ── */}
      <section className="animals-section" id="animals">
        <div className="animals-header">
          <span className="label rv">~ I Nostri Animali ~</span>
          <h2 className="h2 rv rv-d1">Ogni animale ha <em>la sua storia</em></h2>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {[...ANIMALS_MARQUEE, ...ANIMALS_MARQUEE].map((a, i) => (
              <div key={i} className="animal-card">
                <div className="animal-photo">
                  <img src={a.src} alt={a.name} />
                </div>
                <div className="animal-info">
                  <h4>{a.name}</h4>
                  <span>{a.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <span className="label rv">~ Cosa Dicono ~</span>
        <h2 className="h2 rv rv-d1">Le parole di chi è già <em>parte della Coalition</em></h2>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`testi-card rv rv-d${i + 1}`}>
              <div className="testi-stars">{'★'.repeat(t.stars)}</div>
              <div className="testi-quote">{t.quote}</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.name[0]}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-location">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCOMMODATION ── */}
      <section className="accom-section" id="accommodation">
        <span className="label label-light rv">~ Dove Dormire ~</span>
        <h2 className="h2 h2-light rv rv-d1">Tre chalet nel <em>cuore del Waterberg</em></h2>

        <div className="accom-grid">
          {/* No rv class — CSS animation fires immediately */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fadeUp 0.9s 0.2s both' }}>
            <div className="accom-main-img">
              <img src={IMG.accom} alt="Chalet Nova's Legacy" />
            </div>
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img
                src={IMG.accom2}
                alt="Vista sulla riserva"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
              />
            </div>
          </div>
          <div className="accom-right">
            {[
              { icon: '🏡', title: '3 Chalet Indipendenti', desc: 'Self-catering, completamente attrezzati. Cucina, bagno privato, letto matrimoniale o twin.' },
              { icon: '🌿', title: 'Immersi nella Natura',   desc: 'A pochi passi dagli enclosure degli animali. Di notte si sentono i ghepardi.' },
              { icon: '🍽',  title: 'Colazione Inclusa',     desc: 'Ogni mattina prima di andare agli animali. Pranzo e cena su richiesta.' },
              { icon: '📶', title: 'WiFi & Comodità',        desc: 'Acqua calda, elettricità. Tutto il necessario, niente di superfluo.' },
            ].map((f, i) => (
              <div key={f.title} className={`accom-feature rv rv-d${i + 1}`}>
                <div className="accom-feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }} className="rv">
          <button className="btn btn-gold" onClick={() => goTo('visit')}>
            Prenota il Tuo Soggiorno
          </button>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="big-cta">
        <img src={IMG.bigCta} alt="Ghepardo" />
        <div className="big-cta-content">
          <span className="label label-light rv">~ Il Tempo Stringe ~</span>
          <h2 className="rv rv-d1">
            I ghepardi non possono aspettare.<br /><em>Tu puoi agire oggi.</em>
          </h2>
          <p className="rv rv-d2">
            Dona, adotta, fai volontariato o semplicemente condividi.<br />
            Ogni gesto conta. Ogni voce conta.
          </p>
          <div className="rv rv-d3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => goTo('adopt')}>Adotta un Animale</button>
            <button className="btn btn-outline" onClick={() => goTo('volunteer')}>Fai Volontariato</button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <span className="label rv">~ Contattaci ~</span>
        <h2 className="h2 rv rv-d1">Inizia il tuo <em>viaggio nel bush</em></h2>

        <div className="contact-grid">
          <div className="contact-info rv-left">
            <p>
              Hai domande sul volontariato, sugli chalet, sul Cheetah Run o su come
              diventare parte della Coalition? Kim risponde personalmente a ogni messaggio.
            </p>

            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">
                  <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <div className="contact-label">Telefono / WhatsApp</div>
                <div className="contact-value">
                  <a href="tel:+27823520940">+27 82 352 0940</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <div className="contact-label">Indirizzo</div>
                <div className="contact-value">
                  431 Diepdrift, Bela-Bela, 0480<br />Limpopo, South Africa
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a className="social-link" href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">f Facebook</a>
              <a className="social-link" href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">📸 Instagram</a>
            </div>
          </div>

          <form
            className="contact-form rv-right"
            onSubmit={e => { e.preventDefault(); alert('Messaggio inviato! Kim ti risponderà presto.') }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input placeholder="Nome" required />
              <input placeholder="Cognome" required />
            </div>
            <input type="email" placeholder="Email" required />
            <input type="tel" placeholder="Telefono / WhatsApp (opzionale)" />
            <select defaultValue="">
              <option value="" disabled>Motivo del Contatto</option>
              <option>Volontariato</option>
              <option>Internship / Stage</option>
              <option>Soggiorno in Chalet</option>
              <option>Cheetah Run</option>
              <option>Adozione Animale</option>
              <option>Donazione</option>
              <option>Altro</option>
            </select>
            <textarea placeholder="Il tuo messaggio..." rows={5} />
            <button type="submit" className="btn btn-dark">Invia il Messaggio →</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Home
