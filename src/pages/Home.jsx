import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Lightbox from '../components/Lightbox'

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

const GALLERY_SRCS = [
  '/img/chalet-esterno.png',
  '/img/due-ghepardi.png',
  '/img/ghepardo-erba.png',
  '/img/ghepardo-albero.png',
  '/img/volpe-orecchie.png',
  '/img/volontarie-ghepardo.png',
  '/img/volontario-recinzione.png',
  '/img/ghepardo-visita-vet.png',
  '/img/ghepardo-corsa-erba-gialla.png',
  '/img/nova-primo-piano.png',
]

const ANIMALS_SRCS = [
  '/img/nova-primo-piano.png',
  '/img/leone-cucciolo-pneumatico.png',
  '/img/licaone.png',
  '/img/ghepardo-erba-alta.png',
  '/img/cavallo-puledro.png',
  '/img/volpe-orecchie.png',
  '/img/baby-wild.png',
  '/img/serval.png',
]

const ANIMALS_NAMES = ['Nova', 'Shira', 'Ghost Pack', 'Tumelo', 'Spirit', 'Sandy', 'Caracal', 'Serval']

const PROG_PAGES = ['cheetah-run', 'volunteer', 'visit', 'internship', 'adopt', 'conservation']
const PROG_IMGS  = [IMG.progRun, IMG.progVol, IMG.progChalet, IMG.progInt, IMG.progAdopt, IMG.progBreed]

const TESTI_NAMES     = ['Giulia M.', 'Thomas W.', 'Ana R.']
const TESTI_LOCATIONS = ['Milan, Italy', 'Berlin, Germany', 'Madrid, Spain']

function useScrollRevealLocal() {
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
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
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

function Home({ goTo }) {
  useScrollRevealLocal()
  const { t } = useTranslation()

  const galleryCaptions = t('home.gallery_captions', { returnObjects: true })
  const animalRoles     = t('home.animal_roles',     { returnObjects: true })
  const progTags        = t('home.prog_tags',         { returnObjects: true })
  const progTitles      = t('home.prog_titles',       { returnObjects: true })
  const progDescs       = t('home.prog_descs',        { returnObjects: true })
  const volTasks        = t('home.vol_task_list',     { returnObjects: true })
  const testiQuotes     = t('home.testi_quotes',      { returnObjects: true })
  const testiNames      = t('home.testi_names',       { returnObjects: true })
  const testiLocs       = t('home.testi_locations',   { returnObjects: true })
  const accomTitles     = t('home.accom_titles',      { returnObjects: true })
  const accomDescs      = t('home.accom_descs',       { returnObjects: true })

  const heroTitleWords = t('home.hero_title').split(' ')
  const cta2parts = t('home.cta_title').split('. ')

  const [lightboxIdx, setLightboxIdx] = useState(null)

  const [contactForm, setContactForm] = useState({ name: '', surname: '', email: '', phone: '', reason: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)

  async function handleContactSubmit(e) {
    e.preventDefault()
    setContactStatus('sending')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://novas-legacy-api.onrender.com'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      })
      if (!res.ok) throw new Error('server')
      setContactStatus('ok')
      setContactForm({ name: '', surname: '', email: '', phone: '', reason: '', message: '' })
    } catch {
      setContactStatus('error')
    }
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <img className="hero-img" src={IMG.hero} alt="Nova — la gheparda fondatrice" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-eyebrow">{t('home.hero_eyebrow')}</div>
          <h1>
            {heroTitleWords.slice(0, -1).join(' ')}<br />
            <em>{heroTitleWords.slice(-1)}</em>
          </h1>
          <p className="hero-sub">{t('home.hero_sub')}</p>
          <div className="hero-buttons">
            <button className="btn btn-gold" onClick={() => goTo('volunteer')}>
              {t('home.btn_volunteer')}
            </button>
            <button className="btn btn-outline" onClick={() => goTo('nova-story')}>
              {t('home.btn_discover')}
            </button>
          </div>
        </div>

        <div className="hero-strip">
          <StatItem num={7000} suffix="+"   label={t('home.stat_cheetahs')} />
          <StatItem num={865}  suffix=" ha" label={t('home.stat_reserve')} />
          <StatItem num={50}   suffix="+"   label={t('home.stat_animals')} />
          <StatItem num={200}  suffix="+"   label={t('home.stat_volunteers')} />
        </div>
      </section>

      {/* ── ALERT BAR ── */}
      <div className="alert-bar">
        <span className="alert-tag">{t('home.alert_tag')}</span>
        <p>
          {t('home.alert_body_1')}<strong>{t('home.alert_body_strong1')}</strong>{t('home.alert_body_2')}<strong>{t('home.alert_body_strong2')}</strong>{t('home.alert_body_3')}
        </p>
        <button className="btn btn-outline btn-sm" onClick={() => goTo('conservation')}>
          {t('home.alert_btn')}
        </button>
      </div>

      {/* ── WHAT WE DO ── */}
      <section className="what-we-do" style={{ width: '100%', maxWidth: '100%', padding: '5rem 0 0 0' }}>

        {/* Intestazione allineata con font serif originale ripristinato tramite classe .h2 */}
        <div className="what-we-do-content" style={{
          maxWidth: '1200px',
          margin: '0 auto 3.5rem auto',
          padding: '0 2rem'
        }}>
          <span className="label rv">{t('home.work_label')}</span>
          <h2 className="h2 rv rv-d1" style={{ fontSize: '2.6rem', lineHeight: '1.2', margin: '0 0 1.2rem 0' }}>
            {t('home.work_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.work_title').split(' ').slice(-3).join(' ')}</em>
          </h2>
          <p className="rv rv-d2" style={{ color: '#555', maxWidth: '850px', lineHeight: '1.65', margin: 0 }}>
            {t('home.work_desc')}
          </p>
        </div>

        {/* Griglia dei pilastri estesa a tutta larghezza (Full-Width) senza spaziature vuote */}
        <div className="pillars" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          width: '100%',
          margin: 0,
          padding: 0
        }}>
          {/* PILASTRO 1 */}
          <div className="pillar rv" style={{
            position: 'relative',
            flex: '1 1 400px',
            height: '500px',
            overflow: 'hidden'
          }}>
            <img src={IMG.pillar1} alt="Breeding" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              display: 'block'
            }}/>
            <div className="pillar-overlay" style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
              padding: '3rem 2rem 2.5rem 2rem',
              color: '#fff'
            }}>
              <div className="pillar-num" style={{ opacity: 0.5, fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.6rem', margin: '0 0 0.6rem 0', fontFamily: 'var(--serif)' }}>{t('home.pillar1_title')}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '0 0 1.2rem 0', lineHeight: '1.5' }}>{t('home.pillar1_desc')}</p>
              <span className="pillar-link" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => goTo('conservation')}>{t('common.learn_more')}</span>
            </div>
          </div>

          {/* PILASTRO 2 */}
          <div className="pillar rv rv-d1" style={{
            position: 'relative',
            flex: '1 1 400px',
            height: '500px',
            overflow: 'hidden'
          }}>
            <img src={IMG.pillar2} alt="Education" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              display: 'block'
            }}/>
            <div className="pillar-overlay" style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
              padding: '3rem 2rem 2.5rem 2rem',
              color: '#fff'
            }}>
              <div className="pillar-num">02</div>
              <h3 style={{ fontSize: '1.6rem', margin: '0 0 0.6rem 0', fontFamily: 'var(--serif)' }}>{t('home.pillar2_title')}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '0 0 1.2rem 0', lineHeight: '1.5' }}>{t('home.pillar2_desc')}</p>
              <span className="pillar-link" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => goTo('volunteer')}>{t('common.learn_more')}</span>
            </div>
          </div>

          {/* PILASTRO 3 */}
          <div className="pillar rv rv-d2" style={{
            position: 'relative',
            flex: '1 1 400px',
            height: '500px',
            overflow: 'hidden'
          }}>
            <img src={IMG.pillar3} alt="Rehabilitation" style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 50%',
              display: 'block'
            }}/>
            <div className="pillar-overlay" style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
              padding: '3rem 2rem 2.5rem 2rem',
              color: '#fff'
            }}>
              <div className="pillar-num">03</div>
              <h3 style={{ fontSize: '1.6rem', margin: '0 0 0.6rem 0', fontFamily: 'var(--serif)' }}>{t('home.pillar3_title')}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '0 0 1.2rem 0', lineHeight: '1.5' }}>{t('home.pillar3_desc')}</p>
              <span className="pillar-link" style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onClick={() => goTo('horses')}>{t('common.learn_more')}</span>
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
          <span className="label label-light rv">{t('home.run_label')}</span>
          <h2 className="rv rv-d1">
            {(() => {
              const title = t('home.run_title')
              const idx = title.indexOf('Cheetah Run')
              return <>{title.slice(0, idx)}<em>Cheetah Run</em>{title.slice(idx + 11)}</>
            })()}
          </h2>
          <p className="rv rv-d2">{t('home.run_desc')}</p>
          <div className="speed-badge rv rv-d3">
            <span className="num">112</span>
            <span className="txt">km/h<br />{t('home.run_speed_label')}</span>
          </div>
          <button className="btn btn-gold rv rv-d4" onClick={() => goTo('cheetah-run')}>
            {t('home.run_btn')}
          </button>
        </div>
      </section>

      {/* ── PROGRAMS GRID ── */}
      <section className="programs" id="programs" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <span className="label rv">{t('home.programs_label')}</span>
        <h2 className="h2 rv rv-d1" style={{ margin: '0 0 2.5rem 0' }}>
          {t('home.programs_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.programs_title').split(' ').slice(-3).join(' ')}</em>
        </h2>

        {/* Griglia ottimizzata: 3 colonne fisse su desktop, evita buchi e spazi vuoti asimmetrici */}
        <div className="programs-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(var(--grid-cols, 3), 1fr)', /* Configurazione dinamica gestita via CSS o fallback */
          gap: '1.5rem',
          width: '100%'
        }}>
          {PROG_PAGES.map((page, i) => (
              <div
                  key={page}
                  className={`program-card rv rv-d${Math.min(i + 1, 5)}`}
                  onClick={() => goTo(page)}
                  style={{
                    background: 'var(--off-white)',
                    border: '1px solid #EDE5D8',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%' /* Forza tutte le schede ad avere la stessa identica altezza */
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
              >
                {/* Contenitore immagine proporzionato con fuoco alto (280px) */}
                <div className="program-img" style={{ height: '280px', overflow: 'hidden', position: 'relative', width: '100%' }}>
                  <img
                      src={PROG_IMGS[i]}
                      alt={progTitles[i]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 20%'
                      }}
                  />
                </div>

                {/* Corpo del testo spazioso con flex-grow per spingere i link tutti alla stessa altezza */}
                <div className="program-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div className="program-tag" style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '0.3rem'
                  }}>
                    {progTags[i]}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '1.4rem',
                    marginBottom: '0.5rem',
                    color: 'var(--dark)',
                    lineHeight: '1.3'
                  }}>
                    {progTitles[i]}
                  </h3>
                  <p style={{
                    fontSize: '0.84rem',
                    color: '#777',
                    lineHeight: '1.65',
                    fontWeight: 300,
                    marginBottom: '1.4rem',
                    flexGrow: 1 /* Satura lo spazio vuoto se il testo è più corto di un altro blocco */
                  }}>
                    {progDescs[i]}
                  </p>
                  <span className="program-link" style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--dark)',
                    marginTop: 'auto' /* Allinea il link perfettamente sul fondo di ogni card */
                  }}>
                  {t('common.learn_more_arrow')}
                </span>
                </div>
              </div>
          ))}
        </div>

        {/* Piccolo blocco di stile inline per garantire il responsive perfetto senza toccare file CSS esterni */}
        <style>{`
          .programs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          @media (max-width: 992px) {
            .programs-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .programs-grid { grid-template-columns: repeat(1, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── GALLERY ── */}
      <section className="gallery-section" id="gallery">
        <div>
          <span className="label label-light rv">{t('home.gallery_label')}</span>
          <h2 className="h2 h2-light rv rv-d1">
            {t('home.gallery_title').split(' ').slice(0, -2).join(' ')} <em>{t('home.gallery_title').split(' ').slice(-2).join(' ')}</em>
          </h2>
        </div>

        <div className="gallery-masonry">
          {GALLERY_SRCS.map((src, i) => (
            <div key={i} className="gm-item" onClick={() => setLightboxIdx(i)}>
              <img src={src} alt={galleryCaptions[i]} loading="lazy" />
              <div className="gm-caption">{galleryCaptions[i]}</div>
            </div>
          ))}
        </div>

        {lightboxIdx !== null && (
          <Lightbox srcs={GALLERY_SRCS} captions={galleryCaptions} idx={lightboxIdx} setIdx={setLightboxIdx} />
        )}
      </section>

      {/* ── VOLUNTEER ── */}
      <section className="volunteer-section" id="volunteer">
        <div className="volunteer-img-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '3px' }}>
          {[IMG.vol1, IMG.vol2, IMG.vol3, IMG.vol4].map((src, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <img
                src={src}
                alt={`Volunteer ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { e.target.style.transform = 'none' }}
              />
            </div>
          ))}
        </div>
        <div className="vol-content">
          <span className="label rv">{t('home.vol_label')}</span>
          <h2 className="h2 rv rv-d1">
            {t('home.vol_title').split('. ')[0]}. <em>{t('home.vol_title').split('. ')[1]}</em>
          </h2>
          <p className="rv rv-d2">{t('home.vol_desc1')}</p>
          <p className="rv rv-d2">{t('home.vol_desc2')}</p>
          <div className="vol-tasks rv rv-d3">
            {volTasks.map(task => (
              <div key={task} className="vol-task">{task}</div>
            ))}
          </div>
          <button className="btn btn-dark rv rv-d4" onClick={() => goTo('volunteer')}>
            {t('home.vol_btn')}
          </button>
        </div>
      </section>

      {/* ── ANIMALS MARQUEE ── */}
      <section className="animals-section" id="animals">
        <div className="animals-header">
          <span className="label rv">{t('home.animals_label')}</span>
          <h2 className="h2 rv rv-d1">
            {t('home.animals_title').split(' ').slice(0, -2).join(' ')} <em>{t('home.animals_title').split(' ').slice(-2).join(' ')}</em>
          </h2>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {[...Array(2)].flatMap((_, rep) =>
              ANIMALS_NAMES.map((name, i) => (
                <div key={`${rep}-${name}`} className="animal-card">
                  <div className="animal-photo">
                    <img src={ANIMALS_SRCS[i]} alt={name} />
                  </div>
                  <div className="animal-info">
                    <h4>{name}</h4>
                    <span>{animalRoles[i]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <span className="label rv">{t('home.testi_label')}</span>
        <h2 className="h2 rv rv-d1">
          {t('home.testi_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.testi_title').split(' ').slice(-3).join(' ')}</em>
        </h2>

        <div className="testimonials-grid">
          {testiQuotes.map((quote, i) => (
            <div key={i} className={`testi-card rv rv-d${i + 1}`}>
              <div className="testi-stars">{'★'.repeat(5)}</div>
              <div className="testi-quote">{quote}</div>
              <div className="testi-author">
                <div className="testi-avatar">{TESTI_NAMES[i][0]}</div>
                <div>
                  <div className="testi-name">{testiNames[i]}</div>
                  <div className="testi-location">{testiLocs[i]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACCOMMODATION ── */}
      <section className="accom-section" id="accommodation">
        <span className="label label-light rv">{t('home.accom_label')}</span>
        <h2 className="h2 h2-light rv rv-d1">
          {t('home.accom_title').split(' ').slice(0, -1).join(' ')} <em>Waterberg</em>
        </h2>

        <div className="accom-grid">
          <div style={{ animation: 'fadeUp 0.9s 0.2s both' }}>
            <div className="accom-main-img">
              <img src={IMG.accom} alt="Chalet Nova's Legacy" />
            </div>
          </div>
          <div className="accom-right">
            {accomTitles.map((title, i) => (
              <div key={i} className={`accom-feature rv rv-d${i + 1}`}>
                <div className="accom-feature-icon">◆</div>
                <h4>{title}</h4>
                <p>{accomDescs[i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }} className="rv">
          <button className="btn btn-gold" onClick={() => goTo('visit')}>
            {t('home.accom_btn')}
          </button>
        </div>
      </section>

      {/* ── BIG CTA ── */}
      <section className="big-cta">
        <img src={IMG.bigCta} alt="Cheetah" />
        <div className="big-cta-content">
          <span className="label label-light rv">{t('home.cta_label')}</span>
          <h2 className="rv rv-d1">
            {cta2parts[0]}.<br /><em>{cta2parts[1]}</em>
          </h2>
          <p className="rv rv-d2">{t('home.cta_desc')}</p>
          <div className="rv rv-d3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => goTo('adopt')}>{t('home.cta_btn1')}</button>
            <button className="btn btn-outline" onClick={() => goTo('volunteer')}>{t('home.cta_btn2')}</button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <span className="label rv">{t('home.contact_label')}</span>
        <h2 className="h2 rv rv-d1">
          {t('home.contact_title').split(' ').slice(0, -3).join(' ')} <em>{t('home.contact_title').split(' ').slice(-3).join(' ')}</em>
        </h2>

        <div className="contact-grid">
          <div className="contact-info rv-left">
            <p>{t('home.contact_desc')}</p>

            <div className="contact-item">
              <span className="contact-icon">@</span>
              <div>
                <div className="contact-label">{t('home.contact_email_label')}</div>
                <div className="contact-value">
                  <a href="mailto:kim@novaslegacy.co.za">kim@novaslegacy.co.za</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">+</span>
              <div>
                <div className="contact-label">{t('home.contact_phone_label')}</div>
                <div className="contact-value">
                  <a href="tel:+27823520940">+27 82 352 0940</a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon">◆</span>
              <div>
                <div className="contact-label">{t('home.contact_address_label')}</div>
                <div className="contact-value">
                  431 Diepdrift, Bela-Bela, 0480<br />Limpopo, South Africa
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a className="social-link" href="https://facebook.com/Feracare" target="_blank" rel="noreferrer">f Facebook</a>
              <a className="social-link" href="https://instagram.com/novaslegacycheetahproject" target="_blank" rel="noreferrer">◇ Instagram</a>
            </div>
          </div>

          <form
            className="contact-form rv-right"
            onSubmit={handleContactSubmit}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                placeholder={t('home.form_name')} required
                value={contactForm.name}
                onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                placeholder={t('home.form_surname')}
                value={contactForm.surname}
                onChange={e => setContactForm(f => ({ ...f, surname: e.target.value }))}
              />
            </div>
            <input
              type="email" placeholder={t('home.form_email')} required
              value={contactForm.email}
              onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
            />
            <input
              type="tel" placeholder={t('home.form_phone')}
              value={contactForm.phone}
              onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
            />
            <select
              value={contactForm.reason}
              onChange={e => setContactForm(f => ({ ...f, reason: e.target.value }))}
            >
              <option value="" disabled>{t('home.form_reason')}</option>
              <option value={t('home.form_reason_vol')}>{t('home.form_reason_vol')}</option>
              <option value={t('home.form_reason_int')}>{t('home.form_reason_int')}</option>
              <option value={t('home.form_reason_stay')}>{t('home.form_reason_stay')}</option>
              <option value={t('home.form_reason_run')}>{t('home.form_reason_run')}</option>
              <option value={t('home.form_reason_adopt')}>{t('home.form_reason_adopt')}</option>
              <option value={t('home.form_reason_donate')}>{t('home.form_reason_donate')}</option>
              <option value={t('home.form_reason_other')}>{t('home.form_reason_other')}</option>
            </select>
            <textarea
              placeholder={t('home.form_message')} rows={5}
              value={contactForm.message}
              onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
            />
            {contactStatus === 'ok' && (
              <p style={{ color: '#3a7d44', fontFamily: 'Outfit,sans-serif', margin: '0 0 0.5rem' }}>
                {t('home.form_success')}
              </p>
            )}
            {contactStatus === 'error' && (
              <p style={{ color: '#c0392b', fontFamily: 'Outfit,sans-serif', margin: '0 0 0.5rem' }}>
                {t('home.form_error')}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-dark"
              disabled={contactStatus === 'sending'}
            >
              {contactStatus === 'sending' ? '...' : t('common.send_message')}
            </button>
          </form>
        </div>

        <div className="rv" style={{ marginTop: '3rem' }}>
          <iframe
            src="https://maps.google.com/maps?q=-24.845059,28.240967&z=14&output=embed"
            width="100%"
            height="360"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nova's Legacy — Bela-Bela, South Africa"
          />
        </div>
      </section>
    </>
  )
}

export default Home
